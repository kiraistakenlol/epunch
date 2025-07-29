import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { BundleRepository } from './bundle.repository';
import { BundleDto, BundleCreateDto, BundleUseDto, BundleCreatedEvent, BundleUsedEvent } from 'e-punch-common-core';
import { BundleMapper } from '../../mappers';
import { EventService } from '../../events/event.service';
import { UserRepository } from '../user/user.repository';
import { BundleProgramRepository } from '../bundle-program/bundle-program.repository';
import { Authentication } from '../../core/types/authentication.interface';

@Injectable()
export class BundleService {
  private readonly logger = new Logger(BundleService.name);

  constructor(
    private readonly bundleRepository: BundleRepository,
    private readonly userRepository: UserRepository,
    private readonly bundleProgramRepository: BundleProgramRepository,
    private readonly eventService: EventService,
  ) {}

  async getBundleById(bundleId: string, auth: Authentication): Promise<BundleDto> {
    this.logger.log(`Fetching bundle by ID: ${bundleId}`);

    try {
      const bundle = await this.bundleRepository.findBundleById(bundleId);

      if (!bundle) {
        throw new NotFoundException(`Bundle with ID ${bundleId} not found`);
      }

      if (!auth.superAdmin) {
        if (!auth.merchantUser) {
          throw new ForbiddenException('No merchant user found');
        }

        if (bundle.merchant_id !== auth.merchantUser.merchantId) {
          throw new ForbiddenException('Not authorized to access this bundle');
        }
      }

      // Get full details for response
      const bundleWithStyles = await this.bundleRepository.findBundleWithMerchantAndStylesById(bundleId);
      if (!bundleWithStyles) {
        throw new Error('Failed to retrieve bundle with merchant and styles');
      }

      this.logger.log(`Found bundle: ${bundleId}`);
      return BundleMapper.toDtoWithStyles(bundleWithStyles);
    } catch (error: any) {
      this.logger.error(`Error fetching bundle ${bundleId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getUserBundles(userId: string): Promise<BundleDto[]> {
    this.logger.log(`Fetching bundles for user: ${userId}`);
    try {
      const bundlesWithStyles = await this.bundleRepository.findUserBundles(userId);
      this.logger.log(`Found ${bundlesWithStyles.length} bundles for user: ${userId}`);
      return BundleMapper.toDtoArrayWithStyles(bundlesWithStyles);
    } catch (error: any) {
      this.logger.error(`Error fetching bundles for user ${userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async createBundle(data: BundleCreateDto, auth: Authentication): Promise<BundleDto> {
    this.logger.log(`Creating bundle for user ${data.userId} with program ${data.bundleProgramId}`);

    try {
      let user = await this.userRepository.findUserById(data.userId);
      if (!user) {
        user = await this.userRepository.createAnonymousUser(data.userId);
      }

      const bundleProgram = await this.bundleProgramRepository.findBundleProgramById(data.bundleProgramId);
      if (!bundleProgram || bundleProgram.is_deleted) {
        throw new NotFoundException(`Bundle program with ID ${data.bundleProgramId} not found`);
      }

      if (!auth.superAdmin) {
        if (!auth.merchantUser) {
          throw new ForbiddenException('No merchant user found');
        }

        if (bundleProgram.merchant_id !== auth.merchantUser.merchantId) {
          throw new ForbiddenException('You can only create bundles for your own programs');
        }
      }

      const bundle = await this.bundleRepository.createBundle(data);
      const bundleWithStyles = await this.bundleRepository.findBundleWithMerchantAndStylesById(bundle.id);

      if (!bundleWithStyles) {
        throw new Error('Failed to retrieve created bundle with merchant and styles');
      }

      const bundleDto = BundleMapper.toDtoWithStyles(bundleWithStyles);

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

  async useBundle(bundleId: string, data: BundleUseDto, auth: Authentication): Promise<BundleDto> {
    this.logger.log(`Using bundle ${bundleId} with quantity: ${data.quantityUsed || 1}`);

    try {
      const bundle = await this.bundleRepository.findBundleById(bundleId);

      if (!bundle) {
        throw new NotFoundException(`Bundle with ID ${bundleId} not found`);
      }

      if (!auth.superAdmin) {
        if (!auth.merchantUser) {
          throw new ForbiddenException('No merchant user found');
        }

        if (bundle.merchant_id !== auth.merchantUser.merchantId) {
          throw new ForbiddenException('Not authorized to use this bundle');
        }
      }

      const quantityUsed = data.quantityUsed || 1;

      if (quantityUsed <= 0) {
        throw new BadRequestException('Quantity used must be greater than 0');
      }

      if (bundle.remaining_quantity < quantityUsed) {
        throw new BadRequestException(`Insufficient quantity. Available: ${bundle.remaining_quantity}, Requested: ${quantityUsed}`);
      }

      if (bundle.expires_at && bundle.expires_at < new Date()) {
        throw new BadRequestException('Bundle has expired');
      }

      const updatedBundle = await this.bundleRepository.useBundle(bundleId, quantityUsed);
      await this.bundleRepository.createBundleUsage(bundleId, quantityUsed);

      const updatedBundleWithStyles = await this.bundleRepository.findBundleWithMerchantAndStylesById(bundleId);
      if (!updatedBundleWithStyles) {
        throw new Error('Failed to retrieve updated bundle with merchant and styles');
      }

      const bundleDto = BundleMapper.toDtoWithStyles(updatedBundleWithStyles);

      this.logger.log(`Emitting BUNDLE_USED event for user ${bundle.user_id}, bundle ${bundleId}`);
      const bundleUsedEvent: BundleUsedEvent = {
        type: 'BUNDLE_USED',
        userId: bundle.user_id,
        bundle: bundleDto,
        quantityUsed,
      } as BundleUsedEvent;
      this.eventService.emitAppEvent(bundleUsedEvent);

      this.logger.log(`Successfully used bundle: ${bundleId}`);
      return bundleDto;
    } catch (error: any) {
      this.logger.error(`Error using bundle ${bundleId}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 