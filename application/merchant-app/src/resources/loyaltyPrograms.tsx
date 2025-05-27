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
  required,
  minValue,
} from 'react-admin';

export const LoyaltyProgramList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="name" />
      <TextField source="description" />
      <TextField source="rewardDescription" />
      <NumberField source="requiredPunches" />
      <BooleanField source="isActive" />
    </Datagrid>
  </List>
);

export const LoyaltyProgramShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="description" />
      <TextField source="rewardDescription" />
      <NumberField source="requiredPunches" />
      <BooleanField source="isActive" />
      <TextField source="createdAt" />
    </SimpleShowLayout>
  </Show>
);

export const LoyaltyProgramEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <TextInput source="description" multiline rows={3} />
      <TextInput source="rewardDescription" validate={[required()]} multiline rows={2} />
      <BooleanInput source="isActive" />
    </SimpleForm>
  </Edit>
);

export const LoyaltyProgramCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <TextInput source="description" multiline rows={3} />
      <NumberInput source="requiredPunches" validate={[required(), minValue(1)]} />
      <TextInput source="rewardDescription" validate={[required()]} multiline rows={2} />
      <BooleanInput source="isActive" defaultValue={true} />
    </SimpleForm>
  </Create>
); 