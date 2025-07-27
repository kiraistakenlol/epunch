import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BundleProgramRepository } from './bundle-program.repository';
import { MerchantRepository } from '../merchant/merchant.repository';
import { BundleProgramDto, BundleProgramCreateDto, BundleProgramUpdateDto } from 'e-punch-common-core';
import { BundleProgramMapper } from '../../mappers';

@Injectable()
export class BundleProgramService {
  private readonly logger = new Logger(BundleProgramService.name);

  constructor(
    private readonly bundleProgramRepository: BundleProgramRepository,
    private readonly merchantRepository: MerchantRepository
  ) {}

  async getMerchantBundlePrograms(merchantId: string): Promise<BundleProgramDto[]> {
    this.logger.log(`Fetching bundle programs for merchant: ${merchantId}`);

    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);
      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      const bundlePrograms = await this.bundleProgramRepository.findBundleProgramsByMerchantId(merchantId);
      
      this.logger.log(`Found ${bundlePrograms.length} bundle programs for merchant: ${merchantId}`);
      return bundlePrograms.map(program => BundleProgramMapper.toDto(program, merchant));
    } catch (error: any) {
      this.logger.error(`Error fetching bundle programs for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async createBundleProgram(merchantId: string, data: BundleProgramCreateDto): Promise<BundleProgramDto> {
    this.logger.log(`Creating bundle program for merchant: ${merchantId}`);

    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);
      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      const bundleProgram = await this.bundleProgramRepository.createBundleProgram(merchantId, data);
      
      this.logger.log(`Created bundle program ${bundleProgram.id} for merchant: ${merchantId}`);
      return BundleProgramMapper.toDto(bundleProgram, merchant);
    } catch (error: any) {
      this.logger.error(`Error creating bundle program for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateBundleProgram(merchantId: string, programId: string, data: BundleProgramUpdateDto): Promise<BundleProgramDto> {
    this.logger.log(`Updating bundle program ${programId} for merchant: ${merchantId}`);

    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);
      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      const bundleProgram = await this.bundleProgramRepository.updateBundleProgram(merchantId, programId, data);
      if (!bundleProgram) {
        throw new NotFoundException(`Bundle program with ID ${programId} not found for merchant ${merchantId}`);
      }

      this.logger.log(`Updated bundle program ${programId} for merchant: ${merchantId}`);
      return BundleProgramMapper.toDto(bundleProgram, merchant);
    } catch (error: any) {
      this.logger.error(`Error updating bundle program ${programId} for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteBundleProgram(merchantId: string, programId: string): Promise<void> {
    this.logger.log(`Deleting bundle program ${programId} for merchant: ${merchantId}`);

    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);
      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      const deleted = await this.bundleProgramRepository.softDeleteBundleProgram(merchantId, programId);
      if (!deleted) {
        throw new NotFoundException(`Bundle program with ID ${programId} not found for merchant ${merchantId}`);
      }

      this.logger.log(`Deleted bundle program ${programId} for merchant: ${merchantId}`);
    } catch (error: any) {
      this.logger.error(`Error deleting bundle program ${programId} for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getBundleProgram(programId: string): Promise<BundleProgramDto> {
    this.logger.log(`Fetching bundle program: ${programId}`);

    try {
      const bundleProgram = await this.bundleProgramRepository.findBundleProgramById(programId);
      if (!bundleProgram) {
        throw new NotFoundException(`Bundle program with ID ${programId} not found`);
      }

      const merchant = await this.merchantRepository.findMerchantById(bundleProgram.merchant_id);
      if (!merchant) {
        throw new NotFoundException(`Merchant not found for bundle program ${programId}`);
      }

      this.logger.log(`Found bundle program: ${programId}`);
      return BundleProgramMapper.toDto(bundleProgram, merchant);
    } catch (error: any) {
      this.logger.error(`Error fetching bundle program ${programId}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 