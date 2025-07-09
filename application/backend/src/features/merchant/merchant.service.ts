import { Injectable, Logger, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoyaltyProgramDto, MerchantLoginResponse, CreateLoyaltyProgramDto, UpdateLoyaltyProgramDto, MerchantDto, CreateMerchantDto, UpdateMerchantDto, FileUploadUrlDto, FileUploadResponseDto, JwtPayloadDto, MerchantUserDto, CreateMerchantUserDto, UpdateMerchantUserDto, UserDto, PunchCardDto } from 'e-punch-common-core';
import { MerchantRepository } from './merchant.repository';
import { MerchantUserRepository } from '../merchant-user/merchant-user.repository';
import { UserRepository } from '../user/user.repository';
import { FileUploadService } from './file-upload.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MerchantMapper, UserMapper } from '../../mappers';

@Injectable()
export class MerchantService {
  private readonly logger = new Logger(MerchantService.name);

  constructor(
    private readonly merchantRepository: MerchantRepository,
    private readonly merchantUserRepository: MerchantUserRepository,
    private readonly userRepository: UserRepository,
    private readonly fileUploadService: FileUploadService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) { }

  async getAllMerchants(): Promise<MerchantDto[]> {
    this.logger.log('Fetching all merchants');

    try {
      const merchants = await this.merchantRepository.findAllMerchants();
      this.logger.log(`Found ${merchants.length} merchants`);
      return merchants;
    } catch (error: any) {
      this.logger.error(`Error fetching all merchants: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getMerchantById(merchantId: string): Promise<MerchantDto> {
    this.logger.log(`Fetching merchant by ID: ${merchantId}`);

    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);

      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      const merchantDto = MerchantMapper.toDto(merchant);

      this.logger.log(`Found merchant: ${merchantId}`);
      return merchantDto;
    } catch (error: any) {
      this.logger.error(`Error fetching merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getMerchantBySlug(slug: string): Promise<MerchantDto> {
    this.logger.log(`Fetching merchant by slug: ${slug}`);

    try {
      const merchant = await this.merchantRepository.findMerchantBySlug(slug);

      if (!merchant) {
        throw new NotFoundException(`Merchant with slug ${slug} not found`);
      }

      const merchantDto = MerchantMapper.toDto(merchant);

      this.logger.log(`Found merchant: ${slug}`);
      return merchantDto;
    } catch (error: any) {
      this.logger.error(`Error fetching merchant ${slug}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async validateMerchant(merchantSlug: string, login: string, password: string): Promise<MerchantLoginResponse | null> {
    this.logger.log(`Validating merchant user with slug: ${merchantSlug}, login: ${login}`);

    try {
      const user = await this.merchantUserRepository.findUserByMerchantSlugAndLogin(merchantSlug, login);

      if (!user) {
        this.logger.warn(`User not found with slug: ${merchantSlug}, login: ${login}`);
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        this.logger.warn(`Invalid password for user: ${login}`);
        return null;
      }

      const role = await this.merchantUserRepository.getUserRole(user.id);

      if (!role) {
        this.logger.warn(`User ${user.id} has no role assigned`);
        return null;
      }

      const payload = {
        userId: user.id,
        merchantId: user.merchant_id,
        role
      } as JwtPayloadDto;
      
      const token = this.jwtService.sign(payload);

      this.logger.log(`User authenticated successfully: ${merchantSlug}/${login}`);

      return { token };
    } catch (error: any) {
      this.logger.error(`Error validating user ${merchantSlug}/${login}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getMerchantLoyaltyPrograms(merchantId: string): Promise<LoyaltyProgramDto[]> {
    this.logger.log(`Fetching loyalty programs for merchant: ${merchantId}`);

    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);

      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      const loyaltyPrograms = await this.merchantRepository.findLoyaltyProgramsByMerchantId(merchantId);
      this.logger.log(`Found ${loyaltyPrograms.length} loyalty programs for merchant: ${merchantId}`);
      return loyaltyPrograms;
    } catch (error: any) {
      this.logger.error(`Error fetching loyalty programs for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async createLoyaltyProgram(merchantId: string, data: CreateLoyaltyProgramDto): Promise<LoyaltyProgramDto> {
    this.logger.log(`Creating loyalty program for merchant: ${merchantId}`);

    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);

      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      if (data.requiredPunches > 10) {
        throw new HttpException('Required punches cannot exceed 10', HttpStatus.BAD_REQUEST);
      }

      if (data.requiredPunches < 1) {
        throw new HttpException('Required punches must be at least 1', HttpStatus.BAD_REQUEST);
      }

      const loyaltyProgram = await this.merchantRepository.createLoyaltyProgram(merchantId, data);
      this.logger.log(`Created loyalty program ${loyaltyProgram.id} for merchant: ${merchantId}`);
      return loyaltyProgram;
    } catch (error: any) {
      this.logger.error(`Error creating loyalty program for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateLoyaltyProgram(merchantId: string, programId: string, data: UpdateLoyaltyProgramDto): Promise<LoyaltyProgramDto> {
    this.logger.log(`Updating loyalty program ${programId} for merchant: ${merchantId}`);

    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);

      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      if (data.requiredPunches !== undefined) {
        if (data.requiredPunches > 10) {
          throw new HttpException('Required punches cannot exceed 10', HttpStatus.BAD_REQUEST);
        }

        if (data.requiredPunches < 1) {
          throw new HttpException('Required punches must be at least 1', HttpStatus.BAD_REQUEST);
        }
      }

      const loyaltyProgram = await this.merchantRepository.updateLoyaltyProgram(merchantId, programId, data);

      if (!loyaltyProgram) {
        throw new NotFoundException(`Loyalty program with ID ${programId} not found for merchant ${merchantId}`);
      }

      this.logger.log(`Updated loyalty program ${programId} for merchant: ${merchantId}`);
      return loyaltyProgram;
    } catch (error: any) {
      this.logger.error(`Error updating loyalty program ${programId} for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteLoyaltyProgram(merchantId: string, programId: string): Promise<void> {
    this.logger.log(`Deleting loyalty program ${programId} for merchant: ${merchantId}`);

    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);

      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      const deleted = await this.merchantRepository.deleteLoyaltyProgram(merchantId, programId);

      if (!deleted) {
        throw new NotFoundException(`Loyalty program with ID ${programId} not found for merchant ${merchantId} or already deleted`);
      }

      this.logger.log(`Deleted loyalty program ${programId} for merchant: ${merchantId}`);
    } catch (error: any) {
      this.logger.error(`Error deleting loyalty program ${programId} for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async createMerchant(data: CreateMerchantDto): Promise<MerchantDto> {
    this.logger.log(`Creating merchant: ${data.name}`);

    try {
      const merchant = await this.merchantRepository.createMerchant(data);

      this.logger.log(`Created merchant: ${merchant.id}`);
      return merchant;
    } catch (error: any) {
      this.logger.error(`Error creating merchant ${data.name}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateMerchant(merchantId: string, data: UpdateMerchantDto): Promise<MerchantDto> {
    this.logger.log(`Updating merchant: ${merchantId}`);

    try {
      const merchant = await this.merchantRepository.updateMerchant(merchantId, data);

      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      this.logger.log(`Updated merchant: ${merchantId}`);
      return merchant;
    } catch (error: any) {
      this.logger.error(`Error updating merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteMerchant(merchantId: string): Promise<void> {
    this.logger.log(`Deleting merchant: ${merchantId}`);

    try {
      const deleted = await this.merchantRepository.deleteMerchant(merchantId);

      if (!deleted) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      this.logger.log(`Deleted merchant: ${merchantId}`);
    } catch (error: any) {
      this.logger.error(`Error deleting merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async generateFileUploadUrl(merchantId: string, data: FileUploadUrlDto): Promise<FileUploadResponseDto> {
    this.logger.log(`Generating file upload URL for merchant: ${merchantId}`);

    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);

      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      const bucketName = this.configService.getOrThrow<string>('aws.s3.merchantFilesBucketName');
      const key = `merchant-files/${merchantId}/${data.fileName}`;

      const result = await this.fileUploadService.generateFileUploadUrl({
        bucketName,
        key,
        contentType: 'image/webp',
        expiresIn: 3600,
      });

      this.logger.log(`Generated file upload URL for merchant: ${merchantId}`);
      return result;
    } catch (error: any) {
      this.logger.error(`Error generating file upload URL for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getMerchantUsers(merchantId: string): Promise<MerchantUserDto[]> {
    this.logger.log(`Fetching users for merchant: ${merchantId}`);

    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);

      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      const users = await this.merchantUserRepository.findUsersByMerchantId(merchantId);
      this.logger.log(`Found ${users.length} users for merchant: ${merchantId}`);
      return users;
    } catch (error: any) {
      this.logger.error(`Error fetching users for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async createMerchantUser(merchantId: string, data: CreateMerchantUserDto): Promise<MerchantUserDto> {
    this.logger.log(`Creating user for merchant: ${merchantId}`);

    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);

      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      const existingUser = await this.merchantUserRepository.findUserByMerchantAndLogin(merchantId, data.login);
      if (existingUser) {
        throw new HttpException('User with this login already exists for this merchant', HttpStatus.CONFLICT);
      }

      if (data.password.length < 4) {
        throw new HttpException('Password must be at least 4 characters', HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await this.merchantUserRepository.createUser(merchantId, {
        ...data,
        passwordHash: hashedPassword
      });

      this.logger.log(`Created user ${user.id} for merchant: ${merchantId}`);
      return user;
    } catch (error: any) {
      this.logger.error(`Error creating user for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateMerchantUser(merchantId: string, userId: string, data: UpdateMerchantUserDto): Promise<MerchantUserDto> {
    this.logger.log(`Updating user ${userId} for merchant: ${merchantId}`);

    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);

      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      const updateData: any = { ...data };

      if (data.password) {
        if (data.password.length < 4) {
          throw new HttpException('Password must be at least 4 characters', HttpStatus.BAD_REQUEST);
        }
        updateData.passwordHash = await bcrypt.hash(data.password, 10);
        delete updateData.password;
      }

      const user = await this.merchantUserRepository.updateUser(userId, merchantId, updateData);

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found for merchant ${merchantId}`);
      }

      this.logger.log(`Updated user ${userId} for merchant: ${merchantId}`);
      return user;
    } catch (error: any) {
      this.logger.error(`Error updating user ${userId} for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteMerchantUser(merchantId: string, userId: string): Promise<void> {
    this.logger.log(`Deleting user ${userId} for merchant: ${merchantId}`);

    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);

      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      const deleted = await this.merchantUserRepository.deleteUser(userId, merchantId);

      if (!deleted) {
        throw new NotFoundException(`User with ID ${userId} not found for merchant ${merchantId} or already deleted`);
      }

      this.logger.log(`Deleted user ${userId} for merchant: ${merchantId}`);
    } catch (error: any) {
      this.logger.error(`Error deleting user ${userId} for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getMerchantCustomers(
    merchantId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ customers: UserDto[]; total: number; page: number; limit: number }> {
    this.logger.log(`Fetching customers for merchant: ${merchantId}, page: ${page}, limit: ${limit}`);

    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);

      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      const { customers, total } = await this.userRepository.findCustomersByMerchantId(merchantId, page, limit, search, sortBy, sortOrder);

      this.logger.log(`Found ${customers.length} customers for merchant: ${merchantId}`);
      return {
        customers: customers.map(customer => UserMapper.toDto(customer)),
        total,
        page,
        limit,
      };
    } catch (error: any) {
      this.logger.error(`Error fetching customers for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getMerchantCustomer(merchantId: string, customerId: string): Promise<UserDto> {
    this.logger.log(`Fetching customer ${customerId} for merchant: ${merchantId}`);

    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);

      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      const customer = await this.userRepository.findCustomerByMerchantAndId(merchantId, customerId);

      if (!customer) {
        throw new NotFoundException(`Customer with ID ${customerId} not found for merchant ${merchantId}`);
      }

      this.logger.log(`Found customer ${customerId} for merchant: ${merchantId}`);
      return UserMapper.toDto(customer);
    } catch (error: any) {
      this.logger.error(`Error fetching customer ${customerId} for merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getMerchantCustomerPunchCards(merchantId: string, customerId: string): Promise<PunchCardDto[]> {
    this.logger.log(`Fetching punch cards for customer ${customerId} in merchant: ${merchantId}`);

    try {
      const merchant = await this.merchantRepository.findMerchantById(merchantId);

      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }

      const customer = await this.userRepository.findCustomerByMerchantAndId(merchantId, customerId);

      if (!customer) {
        throw new NotFoundException(`Customer with ID ${customerId} not found for merchant ${merchantId}`);
      }

      const punchCards = await this.merchantRepository.findPunchCardsByMerchantAndCustomer(merchantId, customerId);

      this.logger.log(`Found ${punchCards.length} punch cards for customer ${customerId} in merchant: ${merchantId}`);
      return punchCards;
    } catch (error: any) {
      this.logger.error(`Error fetching punch cards for customer ${customerId} in merchant ${merchantId}: ${error.message}`, error.stack);
      throw error;
    }
  }

} 