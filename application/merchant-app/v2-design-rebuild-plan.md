# V2 Design Editor Rebuild Plan

## 🎯 Goal
Replicate the current DesignPage experience using shadcn/ui components and modern patterns while preserving all functionality and improving UX.

## 📋 Current System Analysis

### **Core State Management**
```typescript
// Main state structure to replicate (using useState)
currentStyle: PunchCardStyleDto     // Saved style from API
updatedStyle: PunchCardStyleDto     // Pending changes (null = no changes)
loading: { fetch: boolean, save: boolean }
modalVisibility: { colors: boolean, logo: boolean, icons: boolean }
previewOptions: {
  currentPunches: number           // 0-10
  totalPunches: number            // Usually 10
  status: 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED'
  showAnimations: boolean
}
```

### **Key API Operations**
- `getMerchantDefaultPunchCardStyle(merchantId)` - Fetch current style
- `createOrUpdateMerchantDefaultStyle(merchantId, style)` - Save changes
- `generateFileUploadUrl(merchantId, fileName)` - S3 logo upload
- `searchIcons(query?, page, limit)` - Icon search with pagination

### **Layout Structure**
1. **Preview Section** - Live punch card preview with controls
2. **Quick Actions Grid** - 3 cards (Colors, Logo, Icons) 
3. **Modals** - Separate editors for each customization type

---

## 🏗️ Step-by-Step Rebuild Plan

### **Phase 1: Core Layout & State Management**
- [ ] **Migrate useState hooks** directly from current DesignPage
- [ ] **Port handler functions** with minimal changes
- [ ] **Add shadcn/ui layout structure** using Grid and Cards
- [ ] **Replace react-toastify with Sonner** for notifications

### **Phase 2: Live Preview System**
- [ ] **Build PunchCardPreview component** using iframe approach
- [ ] **Add preview controls** (punch count, status selection)
- [ ] **Implement before/after comparison** with side-by-side cards
- [ ] **Add animation trigger button** for preview animations

### **Phase 3: Quick Actions Grid**
- [ ] **Create 3 action cards** (Colors, Logo, Icons)
- [ ] **Add visual previews** for each customization type
- [ ] **Implement remove buttons** with shadcn/ui Button variants
- [ ] **Add click handlers** to open respective modals

### **Phase 4: Color Editor Modal**
- [ ] **Build color picker interface** with shadcn/ui Dialog
- [ ] **Add primary/secondary color selection** 
- [ ] **Implement color presets grid** 
- [ ] **Add hex input field** with validation
- [ ] **Include reset functionality**

### **Phase 5: Logo Upload Modal** 
- [ ] **Create drag & drop zone** using react-dropzone
- [ ] **Add file validation** (type, size limits)
- [ ] **Implement S3 upload** with progress indication
- [ ] **Add remove logo functionality**
- [ ] **Include upload status feedback**

### **Phase 6: Icon Selection Modal**
- [ ] **Build icon search interface** with shadcn/ui Input
- [ ] **Create icon grid display** with SVG rendering
- [ ] **Add infinite scroll** for pagination
- [ ] **Implement filled/unfilled selection**
- [ ] **Add icon removal capability**

### **Phase 7: Integration & Polish**
- [ ] **Connect all components** with useState handlers
- [ ] **Add keyboard shortcuts** and accessibility
- [ ] **Implement unsaved changes detection**
- [ ] **Add confirmation dialogs** for destructive actions
- [ ] **Polish animations and transitions**

---

## 🔧 Component Architecture

```
DesignEditor/
├── components/
│   ├── PreviewSection.tsx         # Live preview + controls
│   ├── QuickActionsGrid.tsx       # 3 action cards
│   ├── ColorPickerModal.tsx       # Color selection
│   ├── LogoUploadModal.tsx        # File upload
│   ├── IconSelectorModal.tsx      # Icon search & select
│   └── PunchCardPreview.tsx       # Iframe preview
└── DesignEditor.tsx               # Main orchestrator with useState
```

---

## 🎨 UI Component Mapping

| Current Component | New shadcn/ui Components |
|------------------|-------------------------|
| EpunchModal | Dialog + DialogContent |
| EpunchColorPicker | Custom + Popover |
| EpunchCard | Card + CardHeader + CardContent |
| RemoveButton | Button variant="ghost" size="sm" |
| EpunchConfirmOrCancelButtons | Button + ButtonGroup |
| Dropzone styling | Custom styled div |

---

## 🔄 User Flow Replication

### **1. Initial Load**
1. Show loading skeleton
2. Fetch merchant style from API
3. Display current style in preview
4. Populate quick action cards

### **2. Color Customization**
1. Click Colors card → Open color modal
2. Select primary/secondary colors
3. See live preview update
4. Save or cancel changes

### **3. Logo Upload**
1. Click Logo card → Open upload modal  
2. Drag & drop or browse file
3. Validate and upload to S3
4. Update preview immediately
5. Show success feedback

### **4. Icon Selection**
1. Click Icons card → Open icon modal
2. Search available icons
3. Select filled/unfilled variants
4. See live preview update
5. Save selections

### **5. Apply Changes**
1. See "unsaved changes" indicator
2. Use Apply/Reset buttons
3. Save to API with loading state
4. Update current style
5. Show success toast

---

## ⚡ Key Features to Preserve

- ✅ **Live Preview** - Real-time punch card updates
- ✅ **Before/After Comparison** - Side-by-side current vs new
- ✅ **Quick Actions** - One-click edit/remove operations  
- ✅ **Preview Controls** - Punch count, status, animations
- ✅ **File Upload** - Drag & drop with S3 integration
- ✅ **Icon Search** - API-driven with infinite scroll
- ✅ **Color Presets** - Predefined color combinations
- ✅ **Unsaved Changes** - Clear indication of pending changes
- ✅ **Error Handling** - Toast notifications for all operations
- ✅ **Loading States** - Skeleton loading and spinners

---

## 🎯 Success Criteria

1. **Functional Parity** - All current features working
2. **Better UX** - Improved modal UX and responsive design  
3. **Modern UI** - Consistent shadcn/ui styling
4. **Performance** - Faster loading and smoother interactions
5. **Accessibility** - Keyboard navigation and screen reader support
6. **Mobile Ready** - Responsive design for all screen sizes

---

## 🚀 Implementation Order

**Start with:** Phase 1 (Layout & useState Migration) → Phase 2 (Preview) → Phase 3 (Quick Actions)  
**Then build:** One modal at a time (Colors → Logo → Icons)  
**Finish with:** Integration, testing, and polish

Each phase should be fully functional before moving to the next one. 