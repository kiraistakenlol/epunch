import { Injectable, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Inject } from '@nestjs/common';
import { Database, User, Tables } from '../punch-cards/types/database.types'; // Assuming common path for database types

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient<Database>) {}

  async findUserById(id: string): Promise<User | null> {
    this.logger.log(`Attempting to find user with id: ${id}`);
    const { data, error } = await this.supabase
      .from(Tables.user)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      this.logger.error(`Error fetching user with id ${id}:`, error.message);
      // Depending on Supabase client version and RLS, an error might occur if not found,
      // or it might return null data with no error. single() should error if more than one found.
      return null;
    }
    if (!data) {
      this.logger.warn(`No user found with id: ${id}`);
      return null;
    }
    this.logger.log(`Successfully found user with id: ${id}`);
    return data;
  }

  async createUserWithId(id: string): Promise<User | null> {
    this.logger.log(`Attempting to create a new user with id: ${id}`);
    // Ensure the DTO matches the expected structure for insert, especially if 'id' is auto-generated vs. provided.
    // For Supabase, if 'id' is a PK and gen_random_uuid() is the default, providing it should work.
    const { data, error } = await this.supabase
      .from(Tables.user)
      .insert({ id: id })
      .select()
      .single();

    if (error) {
      this.logger.error(`Error creating user with id ${id}:`, error.message);
      // This could fail if the ID already exists due to a race condition or if not UUID and RLS prevents insert
      return null;
    }
    if (!data) {
      this.logger.warn(`User with id ${id} could not be created or data not returned.`);
      return null;
    }
    this.logger.log(`Successfully created user with id: ${data.id}`);
    return data;
  }

  // You can add other methods like createUser, updateUser, etc. as needed.
  // Example for createUser:
  /* 
  async createUser(): Promise<User | null> {
    this.logger.log('Attempting to create a new user');
    const { data, error } = await this.supabase
      .from(Tables.user)
      .insert({})
      .select()
      .single();

    if (error) {
      this.logger.error('Error creating user:', error.message);
      return null;
    }
    if (!data) {
      this.logger.warn('User could not be created or data not returned.');
      return null;
    }
    this.logger.log(`Successfully created user with id: ${data.id}`);
    return data;
  }
  */
} 