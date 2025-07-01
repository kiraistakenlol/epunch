import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoginForm } from '../LoginForm'
import { LoyaltyProgramForm } from '../LoyaltyProgramForm'

export const FormsDemo: React.FC = () => {
  const handleLogin = async (data: any) => {
    console.log('Login data:', data)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert('Login successful! (Demo)')
  }

  const handleLoyaltyProgram = async (data: any) => {
    console.log('Loyalty program data:', data)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert('Loyalty program saved! (Demo)')
  }

  const handleCancel = () => {
    alert('Action cancelled')
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Form System Demo</h1>
        <p className="text-muted-foreground">
          Demonstrating the new shadcn/ui form components with react-hook-form and zod validation
        </p>
      </div>

      <Tabs defaultValue="login" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="login">Login Form</TabsTrigger>
          <TabsTrigger value="loyalty-create">Create Loyalty Program</TabsTrigger>
          <TabsTrigger value="loyalty-edit">Edit Loyalty Program</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Login Form Demo</CardTitle>
              <CardDescription>
                Features: Real-time validation, error handling, loading states, and merchant slug validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty-create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Loyalty Program Form</CardTitle>
              <CardDescription>
                Features: Mixed input types, validation, text areas, number inputs, and switches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoyaltyProgramForm
                onSubmit={handleLoyaltyProgram}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty-edit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Edit Loyalty Program Form</CardTitle>
              <CardDescription>
                Same form with pre-filled data and edit mode
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoyaltyProgramForm
                isEdit={true}
                initialData={{
                  name: 'Coffee Lover Rewards',
                  description: 'Earn rewards for every coffee purchase',
                  maxPunches: 10,
                  rewardDescription: 'Get one free coffee',
                  isActive: true,
                  termsAndConditions: 'Valid for 6 months from issue date'
                }}
                onSubmit={handleLoyaltyProgram}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Form System Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">✅ Completed Features</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• react-hook-form integration</li>
                <li>• Zod validation schemas</li>
                <li>• Real-time validation</li>
                <li>• Loading states</li>
                <li>• Error handling with toast notifications</li>
                <li>• Consistent form styling</li>
                <li>• Multiple input types (text, number, textarea, switch)</li>
                <li>• Form-level error display</li>
                <li>• Accessible form components</li>
                <li>• TypeScript support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🎯 Form Components</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• FormField - Universal form field component</li>
                <li>• FormActions - Submit/cancel button group</li>
                <li>• FormErrorDisplay - Error message display</li>
                <li>• LoginForm - Complete login form</li>
                <li>• LoyaltyProgramForm - Complete loyalty program form</li>
                <li>• useLoginForm - Specialized login hook</li>
                <li>• useLoyaltyProgramForm - Specialized loyalty hook</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 