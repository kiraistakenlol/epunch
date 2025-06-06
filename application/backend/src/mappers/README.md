# Mapper Architecture

This directory contains mapper utilities that consolidate all database entity to DTO conversion logic. This eliminates code duplication and provides a centralized place for managing data transformations.

## Architecture Overview

The mapper architecture follows these principles:

1. **Static utility classes** - Each mapper is a class with static methods for easy importing and usage
2. **Type safety** - All mappers are fully typed with TypeScript interfaces
3. **Separation of concerns** - Each entity has its own mapper file
4. **Reusability** - Mappers can be used across services, repositories, and controllers
5. **Consistency** - All DTO conversions follow the same patterns

## Available Mappers

### UserMapper
- `toDto(user: User): UserDto` - Convert single user entity to DTO
- `toDtoArray(users: User[]): UserDto[]` - Convert array of user entities to DTOs

### MerchantMapper
- `toDto(merchant: Merchant): MerchantDto` - Convert single merchant entity to DTO
- `toDtoArray(merchants: Merchant[]): MerchantDto[]` - Convert array of merchant entities to DTOs

### LoyaltyProgramMapper
- `toDto(loyaltyProgram: LoyaltyProgram, merchant: Merchant): LoyaltyProgramDto` - Convert loyalty program with merchant info
- `fromJoinedQuery(row: LoyaltyProgramWithMerchant): LoyaltyProgramDto` - Convert from SQL JOIN result
- `fromJoinedQueryArray(rows: LoyaltyProgramWithMerchant[]): LoyaltyProgramDto[]` - Convert array from SQL JOIN results

### PunchCardMapper
- `toDto(punchCard: PunchCardWithDetails): PunchCardDto` - Convert punch card with merchant details
- `toDtoArray(punchCards: PunchCardWithDetails[]): PunchCardDto[]` - Convert array of punch cards
- `basicToDto(punchCard: PunchCard, merchantName: string, merchantAddress: string | null, requiredPunches: number): PunchCardDto` - Convert basic punch card with separate merchant info

## Usage Examples

### In Services
```typescript
import { UserMapper } from '../../mappers';

// Convert single entity
const userDto = UserMapper.toDto(userEntity);

// Convert array
const userDtos = UserMapper.toDtoArray(userEntities);
```

### In Repositories
```typescript
import { MerchantMapper, LoyaltyProgramMapper } from '../../mappers';

// Simple conversion
return MerchantMapper.toDtoArray(result.rows);

// Complex conversion with relationships
return LoyaltyProgramMapper.fromJoinedQueryArray(result.rows);
```

### In Controllers
```typescript
import { UserMapper } from '../../mappers';

async getAllUsers(): Promise<UserDto[]> {
  const users = await this.userRepository.findAllUsers();
  return UserMapper.toDtoArray(users);
}
```

## Benefits

1. **DRY Principle** - No more repeated conversion logic across the codebase
2. **Maintainability** - Changes to DTO structure only need to be made in one place
3. **Type Safety** - Full TypeScript support with proper typing
4. **Testability** - Mappers can be easily unit tested in isolation
5. **Consistency** - All conversions follow the same patterns and handle edge cases uniformly
6. **Performance** - Optimized conversion logic without redundant operations

## Adding New Mappers

When adding a new entity, follow these steps:

1. Create a new mapper file: `src/mappers/entity-name.mapper.ts`
2. Export the mapper class with static methods
3. Add the export to `src/mappers/index.ts`
4. Update this README with the new mapper documentation

Example template:
```typescript
import { EntityDto } from 'e-punch-common-core';
import { Entity } from '../features/entity/entity.repository';

export class EntityMapper {
  static toDto(entity: Entity): EntityDto {
    return {
      id: entity.id,
      // ... other fields
      createdAt: entity.created_at.toISOString(),
    };
  }

  static toDtoArray(entities: Entity[]): EntityDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}
``` 