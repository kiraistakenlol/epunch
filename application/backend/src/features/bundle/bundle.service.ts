import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { BundleRepository } from './bundle.repository';
import { BundleDto, BundleCreateDto, BundleUpdateDto, BundleCreatedEvent, BundleUsedEvent } from 'e-punch-common-core';
import { BundleMapper } from '../../mappers';
import { EventService } from '../../events/event.service';
import { UserRepository } from '../user/user.repository';
import { BundleProgramRepository } from '../bundle-program/bundle-program.repository';
import { Authentication, AuthorizationService } from '../../core';

@Injectable()
export class BundleService {
  private readonly logger = new Logger(BundleService.name);

  constructor(
    private readonly bundleRepository: BundleRepository,
    private readonly userRepository: UserRepository,
    private readonly bundleProgramRepository: BundleProgramRepository,
    private readonly eventService: EventService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async getBundleById(bundleId: string, auth: Authentication): Promise<BundleDto> {
    this.logger.log(`Fetching bundle by ID: ${bundleId}`);

    const bundle = await this.bundleRepository.getBundleById(bundleId);

    this.authorizationService.validateBundleReadAccess(auth, bundle);

    this.logger.log(`Found bundle: ${bundleId}`);
    return BundleMapper.toDto(bundle);
  }

  async getUserBundles(userId: string, auth: Authentication): Promise<BundleDto[]> {
    this.logger.log(`Fetching bundles for user: ${userId}`);
    
    this.authorizationService.validateGetUserBundlesAccess(auth, userId);

    try {
      const bundlesWithStyles = await this.bundleRepository.findUserBundles(userId);

      this.logger.log(`Found ${bundlesWithStyles.length} bundles for user: ${userId}`);
      return BundleMapper.toDtoArray(bundlesWithStyles);
    } catch (error: any) {
      this.logger.error(`Error fetching bundles for user ${userId}: ${error.message}`, error.stack);
      throw error;
    }
  }
  
  async createBundle(data: BundleCreateDto, auth: Authentication): Promise<BundleDto> {
    this.logger.log(`Creating bundle for user ${data.userId} with program ${data.bundleProgramId}`);

    try {
      const bundleProgram = await this.bundleProgramRepository.getBundleProgramById(data.bundleProgramId);

      this.authorizationService.validateBundleCreateAccess(auth, bundleProgram);

      const user = await this.userRepository.getUserById(data.userId);
      // todo check that user is not anonymous (if not, throw error)

      const expiresAt = data.validityDays 
        ? new Date(Date.now() + data.validityDays * 24 * 60 * 60 * 1000)
        : null;

      const bundle = await this.bundleRepository.createBundle(
        data.userId,
        data.bundleProgramId,
        data.quantity,
        expiresAt
      );
      const bundleWithStyles = await this.bundleRepository.getBundleById(bundle.id);

      const bundleDto = BundleMapper.toDto(bundleWithStyles);

      this.logger.log(`Emitting BUNDLE_CREATED event for user ${data.userId}, bundle ${bundle.id}`);
      const bundleCreatedEvent: BundleCreatedEvent = {
        type: 'BUNDLE_CREATED',
        userId: data.userId,
        bundle: bundleDto,
      };
      this.eventService.emitAppEvent(bundleCreatedEvent);

      this.logger.log(`Successfully created bundle: ${bundle.id}`);
      return bundleDto;
    } catch (error: any) {
      this.logger.error(`Error creating bundle for user ${data.userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateBundle(bundleId: string, updateData: BundleUpdateDto, auth: Authentication): Promise<BundleDto> {
    this.logger.log(`Updating bundle ${bundleId} with data:`, updateData);

    const bundle = await this.bundleRepository.getBundleById(bundleId);

    this.authorizationService.validateBundleUpdateAccess(auth, bundle);

    const newRemainingQuantity = updateData.remainingQuantity;

    if (newRemainingQuantity < 0) {
      throw new BadRequestException('Remaining quantity cannot be negative');
    }

    if (newRemainingQuantity > bundle.original_quantity) {
      throw new BadRequestException(`Remaining quantity cannot exceed original quantity. Original: ${bundle.original_quantity}, Requested: ${newRemainingQuantity}`);
    }

    if (bundle.expires_at && bundle.expires_at < new Date()) {
      throw new BadRequestException('Bundle has expired');
    }

    const quantityChange = bundle.remaining_quantity - newRemainingQuantity;

    await this.bundleRepository.updateBundleQuantity(bundleId, newRemainingQuantity);
    
    if (quantityChange !== 0) {
      await this.bundleRepository.createBundleUsage(bundleId, quantityChange);
    }

    const updatedBundle = await this.bundleRepository.getBundleById(bundleId);

    const bundleDto = BundleMapper.toDto(updatedBundle);

    if (quantityChange !== 0) {
      this.logger.log(`Emitting BUNDLE_USED event for user ${bundle.user_id}, bundle ${bundleId}`);
      const bundleUsedEvent: BundleUsedEvent = {
        type: 'BUNDLE_USED',
        userId: bundle.user_id,
        bundle: bundleDto,
        quantityUsed: quantityChange,
      } as BundleUsedEvent;
      this.eventService.emitAppEvent(bundleUsedEvent);
    }

    this.logger.log(`Successfully updated bundle ${bundleId}`);
    return bundleDto;
  }
} 