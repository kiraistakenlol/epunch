import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { loginMerchant, selectIsAuthenticated } from '../../../store/authSlice'
import { Form } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField } from './FormField'
import { FormActions } from './FormActions'
import { FormErrorDisplay } from './FormErrorDisplay'
import { useLoginForm } from './hooks/useForm'

export const LoginForm: React.FC = () => {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const form = useLoginForm({
    onSubmit: async (data) => {
      setSubmitError(null)
      try {
        await dispatch(loginMerchant({
          merchantSlug: data.merchantSlug.trim(),
          login: data.login.trim(),
          password: data.password
        })).unwrap()
        navigate('/')
      } catch (err: any) {
        throw new Error(err.message || 'Login failed. Please check your credentials.')
      }
    },
    onError: (error) => {
      setSubmitError(error.message || 'Please check your input and try again.')
    }
  })

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleDismissError = () => {
    setSubmitError(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">E-PUNCH Merchant</CardTitle>
          <CardDescription>
            Sign in to your merchant account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.submitHandler} className="space-y-4">
              <FormErrorDisplay 
                error={submitError} 
                onDismiss={handleDismissError}
                className="mb-4"
              />
              
              <FormField
                name="merchantSlug"
                label="Merchant Slug"
                placeholder="Enter merchant slug (e.g., cafe-central)"
                disabled={form.isSubmitting}
                required
              />
              
              <FormField
                name="login"
                label="Login"
                placeholder="Enter your login"
                disabled={form.isSubmitting}
                required
              />
              
              <FormField
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                disabled={form.isSubmitting}
                required
              />
              
              <FormActions
                submitText="Sign In"
                submitingText="Signing In..."
                isSubmitting={form.isSubmitting}
                isValid={form.formState.isValid}
                showCancelButton={false}
                className="pt-6"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 