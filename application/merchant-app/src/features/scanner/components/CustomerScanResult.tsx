import React, { useEffect, useState } from 'react'
import { apiClient } from 'e-punch-common-ui'
import { LoyaltyProgramDto } from 'e-punch-common-core'
import { useAppSelector, useAppDispatch } from '../../../store/hooks'
import { fetchBundlePrograms, selectBundlePrograms, selectBundleProgramsLoading } from '../../../store/bundleProgramsSlice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Loader2, User, CreditCard, ArrowLeft, Package } from 'lucide-react'
import { cn } from '@/lib/cn'
import { PunchCardsTab } from './PunchCardsTab'
import { BundlesTab } from './BundlesTab'

// Main CustomerScanResult Component
interface CustomerScanResultProps {
  onPunch: (loyaltyProgramId: string) => void
  onReset: () => void
  onSuccess: (message: string) => void
  userId: string
  className?: string
}

export const CustomerScanResult: React.FC<CustomerScanResultProps> = ({
  onPunch,
  onReset,
  onSuccess,
  userId,
  className
}) => {
  const dispatch = useAppDispatch()
  const merchantId = useAppSelector(state => state.merchant.merchant?.id)
  const bundlePrograms = useAppSelector(selectBundlePrograms)
  const bundleProgramsLoading = useAppSelector(selectBundleProgramsLoading)
  
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgramDto[]>([])
  const [selectedLoyaltyProgramId, setSelectedLoyaltyProgramId] = useState<string>('')
  const [selectedBundleProgramId, setSelectedBundleProgramId] = useState<string>('')
  const [selectedBundlePresetIndex, setSelectedBundlePresetIndex] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'punch-cards' | 'bundles'>('punch-cards')

  useEffect(() => {
    const fetchData = async () => {
      if (!merchantId) return

      setIsLoading(true)
      try {
        // Fetch loyalty programs
        const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId)
        const activePrograms = programs.filter(p => p.isActive)
        setLoyaltyPrograms(activePrograms)
        
        // Fetch bundle programs
        dispatch(fetchBundlePrograms(merchantId))
      } catch (error: any) {
        console.error('Failed to fetch programs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [merchantId, dispatch])

  // Filter active bundle programs
  const activeBundlePrograms = bundlePrograms.filter(program => program.isActive)

  // Determine if we should show tabs (both types exist and not loading)
  const shouldShowTabs = !isLoading && !bundleProgramsLoading && loyaltyPrograms.length > 0 && activeBundlePrograms.length > 0

  // Handle mutual exclusivity between loyalty programs and bundles
  const handleLoyaltyProgramSelect = (programId: string) => {
    setSelectedLoyaltyProgramId(programId)
    // Clear bundle selection when loyalty program is selected
    if (selectedBundleProgramId) {
      setSelectedBundleProgramId('')
      setSelectedBundlePresetIndex(0)
    }
  }

  const handleBundleProgramSelect = (programId: string) => {
    setSelectedBundleProgramId(programId)
    setSelectedBundlePresetIndex(0)
    // Clear loyalty program selection when bundle is selected
    if (selectedLoyaltyProgramId) {
      setSelectedLoyaltyProgramId('')
    }
  }

  // Handle tab changes - clear selections when switching tabs
  const handleTabChange = (value: string) => {
    const newTab = value as 'punch-cards' | 'bundles'
    setActiveTab(newTab)
    
    // Clear selections when switching tabs
    if (newTab === 'punch-cards') {
      setSelectedBundleProgramId('')
      setSelectedBundlePresetIndex(0)
    } else if (newTab === 'bundles') {
      setSelectedLoyaltyProgramId('')
    }
  }



  const handlePunch = () => {
    if (selectedLoyaltyProgramId) {
      onPunch(selectedLoyaltyProgramId)
    }
  }

  if (isLoading || bundleProgramsLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className={cn("p-2 sm:p-4 max-h-[90vh] flex flex-col w-full", className)}>
      <Card className="flex-1 flex flex-col w-full">
        <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <Badge variant="outline" className="text-xs sm:text-sm px-2 sm:px-3 py-1">Customer</Badge>
            </div>
            <div className="w-8" /> {/* Spacer for balance */}
          </div>
          <CardTitle className="text-xl sm:text-2xl text-center">Choose Action</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col px-4 sm:px-6">
          {loyaltyPrograms.length === 0 && activeBundlePrograms.length === 0 ? (
            <div className="text-center py-4 sm:py-6 flex-1 flex items-center justify-center">
              <p className="text-sm sm:text-base text-muted-foreground">No active programs</p>
            </div>
          ) : shouldShowTabs ? (
            // Tabbed interface when both types exist
            <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="punch-cards" className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Punch Cards</span>
                </TabsTrigger>
                <TabsTrigger value="bundles" className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Bundles</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="punch-cards" className="flex-1">
                <PunchCardsTab
                  loyaltyPrograms={loyaltyPrograms}
                  selectedLoyaltyProgramId={selectedLoyaltyProgramId}
                  onLoyaltyProgramSelect={handleLoyaltyProgramSelect}
                  onPunch={handlePunch}
                />
              </TabsContent>
              
              <TabsContent value="bundles" className="flex-1">
                <BundlesTab
                  activeBundlePrograms={activeBundlePrograms}
                  selectedBundleProgramId={selectedBundleProgramId}
                  selectedBundlePresetIndex={selectedBundlePresetIndex}
                  onBundleProgramSelect={handleBundleProgramSelect}
                  onPresetSelect={setSelectedBundlePresetIndex}
                  userId={userId}
                  onSuccess={onSuccess}
                />
              </TabsContent>
            </Tabs>
          ) : (
            // Separate sections when only one type exists
            <div className="flex-1 flex flex-col space-y-4 sm:space-y-6">
              {/* Punch Cards Section */}
              {loyaltyPrograms.length > 0 && (
                <div className="flex flex-col space-y-2 sm:space-y-3">
                  <p className="text-sm sm:text-base font-medium text-muted-foreground">Punch Cards:</p>
                  <PunchCardsTab
                    loyaltyPrograms={loyaltyPrograms}
                    selectedLoyaltyProgramId={selectedLoyaltyProgramId}
                    onLoyaltyProgramSelect={handleLoyaltyProgramSelect}
                    onPunch={handlePunch}
                  />
                </div>
              )}

              {/* Bundles Section */}
              {activeBundlePrograms.length > 0 && (
                <div className="flex flex-col space-y-2 sm:space-y-3">
                  <p className="text-sm sm:text-base font-medium text-muted-foreground">Bundles:</p>
                  <BundlesTab
                    activeBundlePrograms={activeBundlePrograms}
                    selectedBundleProgramId={selectedBundleProgramId}
                    selectedBundlePresetIndex={selectedBundlePresetIndex}
                    onBundleProgramSelect={handleBundleProgramSelect}
                    onPresetSelect={setSelectedBundlePresetIndex}
                    userId={userId}
                    onSuccess={onSuccess}
                  />
                        </div>
                      )}
            </div>
          )}
                </CardContent>
      </Card>
    </div>
  )
} 