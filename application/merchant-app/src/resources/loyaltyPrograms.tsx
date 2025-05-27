import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  Show,
  SimpleShowLayout,
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  Create,
} from 'react-admin';

export const LoyaltyProgramList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="name" />
      <TextField source="rewardDescription" />
      <NumberField source="punchesRequired" />
      <BooleanField source="isActive" />
    </Datagrid>
  </List>
);

export const LoyaltyProgramShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="rewardDescription" />
      <NumberField source="punchesRequired" />
      <BooleanField source="isActive" />
      <TextField source="createdAt" />
      <TextField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);

export const LoyaltyProgramEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="rewardDescription" multiline />
      <NumberInput source="punchesRequired" />
      <BooleanInput source="isActive" />
    </SimpleForm>
  </Edit>
);

export const LoyaltyProgramCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="rewardDescription" multiline />
      <NumberInput source="punchesRequired" />
      <BooleanInput source="isActive" defaultValue={true} />
    </SimpleForm>
  </Create>
); 