import React from 'react'
import { LoyaltyProgramDto } from 'e-punch-common-core'
import { Button } from '@/components/ui/button'
import { CreditCard } from 'lucide-react'
import { cn } from '@/lib/cn'

interface PunchCardsTabProps {
  loyaltyPrograms: LoyaltyProgramDto[]
  selectedLoyaltyProgramId: string
  onLoyaltyProgramSelect: (programId: string) => void
  onPunch: () => void
}

export const PunchCardsTab: React.FC<PunchCardsTabProps> = ({
  loyaltyPrograms,
  selectedLoyaltyProgramId,
  onLoyaltyProgramSelect,
  onPunch
}) => {
  return (
    <div className="flex-1 flex flex-col space-y-4">
      <div className="space-y-2 sm:space-y-3 pr-1 sm:pr-2">
        {loyaltyPrograms.map((program) => (
          <div
            key={program.id}
            onClick={() => onLoyaltyProgramSelect(program.id)}
            className={cn(
              "p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
              "hover:shadow-md active:scale-[0.98] min-h-[56px] sm:min-h-[60px]",
              selectedLoyaltyProgramId === program.id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-background hover:border-primary/50"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <h3 className="font-medium text-sm sm:text-base leading-tight">{program.name}</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {program.requiredPunches} punches → {program.rewardDescription}
                </p>
              </div>
              {selectedLoyaltyProgramId === program.id && (
                <div className="flex-shrink-0 ml-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Punch Button */}
      <Button 
        onClick={onPunch}
        disabled={!selectedLoyaltyProgramId}
        className="w-full h-12 sm:h-14 text-sm sm:text-base flex items-center justify-center mt-4"
      >
        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
        Punch
      </Button>
    </div>
  )
} 