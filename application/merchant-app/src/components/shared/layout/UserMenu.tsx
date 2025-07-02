import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logoutMerchant } from '@/store/authSlice'
import { useNavigate } from 'react-router-dom'

export function UserMenu() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(state => state.auth.user)

  const handleLogout = async () => {
    await dispatch(logoutMerchant())
    navigate('/login')
  }

  const getRoleDisplay = () => {
    if (user?.role) {
      return user.role.charAt(0).toUpperCase()
    }
    return 'U'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 rounded-full p-0 hover:bg-accent focus-visible:ring-0"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
            {getRoleDisplay()}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 