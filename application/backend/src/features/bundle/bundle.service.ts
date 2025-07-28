import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { BundleRepository } from './bundle.repository';
import { BundleDto, BundleCreateDto, BundleUseDto } from 'e-punch-common-core';
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
    this.logger.log(`Fetching bundle: ${bundleId}`);

    try {
      const bundleWithProgram = await this.bundleRepository.findBundleWithProgramById(bundleId);

      if (!bundleWithProgram) {
        throw new NotFoundException(`Bundle with ID ${bundleId} not found`);
      }

      if (!auth.superAdmin) {
        if (!auth.merchantUser) {
          throw new ForbiddenException('No merchant user found');
        }

        if (bundleWithProgram.merchant_id !== auth.merchantUser.merchantId) {
          throw new ForbiddenException('Not authorized to access this bundle');
        }
      }

      this.logger.log(`Found bundle: ${bundleId}`);
      return BundleMapper.toDto(bundleWithProgram);
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
      const bundleWithProgram = await this.bundleRepository.findBundleWithProgramById(bundle.id);

      if (!bundleWithProgram) {
        throw new Error('Failed to retrieve created bundle');
      }

      const bundleDto = BundleMapper.toDto(bundleWithProgram);

      this.logger.log(`Emitting BUNDLE_CREATED event for user ${data.userId}, bundle ${bundle.id}`);
      this.eventService.emitAppEvent({
        type: 'BUNDLE_CREATED',
        userId: data.userId,
        bundle: bundleDto,
      });

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
      const bundleWithProgram = await this.bundleRepository.findBundleWithProgramById(bundleId);

      if (!bundleWithProgram) {
        throw new NotFoundException(`Bundle with ID ${bundleId} not found`);
      }

      if (!auth.superAdmin) {
        if (!auth.merchantUser) {
          throw new ForbiddenException('No merchant user found');
        }

        if (bundleWithProgram.merchant_id !== auth.merchantUser.merchantId) {
          throw new ForbiddenException('Not authorized to use this bundle');
        }
      }

      const quantityUsed = data.quantityUsed || 1;

      if (quantityUsed <= 0) {
        throw new BadRequestException('Quantity used must be greater than 0');
      }

      if (bundleWithProgram.remaining_quantity < quantityUsed) {
        throw new BadRequestException(`Insufficient quantity. Available: ${bundleWithProgram.remaining_quantity}, Requested: ${quantityUsed}`);
      }

      if (bundleWithProgram.expires_at && bundleWithProgram.expires_at < new Date()) {
        throw new BadRequestException('Bundle has expired');
      }

      const updatedBundle = await this.bundleRepository.useBundle(bundleId, quantityUsed);
      await this.bundleRepository.createBundleUsage(bundleId, quantityUsed);

      const updatedBundleWithProgram = await this.bundleRepository.findBundleWithProgramById(bundleId);
      if (!updatedBundleWithProgram) {
        throw new Error('Failed to retrieve updated bundle');
      }

      const bundleDto = BundleMapper.toDto(updatedBundleWithProgram);

      this.logger.log(`Emitting BUNDLE_USED event for user ${bundleWithProgram.user_id}, bundle ${bundleId}`);
      this.eventService.emitAppEvent({
        type: 'BUNDLE_USED',
        userId: bundleWithProgram.user_id,
        bundle: bundleDto,
        quantityUsed,
      });

      this.logger.log(`Successfully used bundle: ${bundleId}. Remaining quantity: ${updatedBundle.remaining_quantity}`);
      return bundleDto;
    } catch (error: any) {
      this.logger.error(`Error using bundle ${bundleId}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 