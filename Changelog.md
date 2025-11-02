# Change Log

## Version 2.0.0 - V13 Compatibility (Fork)

**Full Foundry VTT V13 compatibility update**

### API Migrations
- **Scene Data Structure**: Updated all references from `scene.darkness` to `scene.environment.darknessLevel`
- **Scene Update Calls**: Migrated to `scene.update({"environment.darknessLevel": value})` pattern
- **Global Light Path**: Updated to `scene.environment.globalLight.darkness.max`
- **SceneConfig Namespace**: Changed from global `SceneConfig` to `foundry.applications.sheets.SceneConfig`

### Hook System Refactoring
- **ApplicationV2 Compatibility**: Updated `renderSceneConfig` hook to handle ApplicationV2 lifecycle
  - Changed from `sheet.object` to `sheet.document` for scene access
  - Added jQuery wrapping for HTML parameters (no longer auto-wrapped in V13)
  - Implemented duplicate injection prevention with class markers
- **LibWrapper Replacement**: Replaced `_onSubmit` wrapper with native `closeDocumentSheet` hook
  - More reliable form data capture using standard V13 patterns
  - Better compatibility with other modules

### UI/UX Improvements
- **V13 Form Styling**: Completely rebuilt settings UI to match V13 design patterns
  - Converted to `<fieldset>` and `<legend>` structure
  - Updated hints to use `<p class="hint">` formatting
  - Checkbox labels now use `<span>` wrapper for consistency
- **Smart Insertion Logic**: Enhanced settings injection to target lighting tab specifically
  - Finds last fieldset in lighting tab for proper placement
  - Prevents nesting inside other fieldsets
  - Eliminates duplicate insertions

### Module Manifest
- **V13 Format**: Updated `module.json` to V13 schema requirements
  - Added `id` field (required in V13)
  - Updated compatibility ranges: minimum 12, verified 13, maximum 13
  - Bumped version to 2.0.0 for semantic versioning

### Technical Debt
- Removed deprecated `scene.data` wrapper access pattern
- Cleaned up console logging for better debugging
- Improved error handling in hook callbacks

---

#### 0009 - Bug Fix

- Darkness Depreciation Warning Fixed


#### 0008 - V12 Compatibility

- V12 Compatibility

#### 0007 - V11 Compatibility

- V11 Compatibility

#### 0006 - V10 Compatibility

- Lighting now updated on active scene and any scene being viewed by any player.
- V10 Compatibility

#### 0005 - Bug Fix

- NaN Bug Fixed
- Moon Lighting Cycles unavailable in languages other than English (under investigation)

#### 0004 - V9 Compatibility Version

- V9 Compatibility
- Moon Lighting Cycles added
- Max lighting level added

#### 0003

- Edge case bug causing update to fail resolved - requires Simple Calendar v1.3.66 or greater

#### 0002

- 0.8.6 compatibility confirmed

#### 0001

- First Full Release