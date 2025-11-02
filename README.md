# Day Night Cycle - V13 Fork

> **Note**: This is a community fork updated for Foundry VTT V13 compatibility.
> 
> Original module by [SDoehren](https://github.com/sdoehren/day-night-cycle)  
> Fork maintained by [KonteiKeisei](https://github.com/KonteiKeisei/day-night-cycle)

Day Night Cycle automatically changes the lighting levels to reflect the time of day based on the time in [Simple Calendar](https://github.com/vigoren/foundryvtt-simple-calendar).

[Youtube Example](https://www.youtube.com/watch?v=3jIHKkcawq8)

## V13 Compatibility

This fork has been fully updated for Foundry VTT V13 (Build 13.341+):

- **ApplicationV2 Framework**: Updated Scene Config integration to use new ApplicationV2 patterns
- **Scene API Modernization**: Migrated from deprecated `scene.darkness` to `scene.environment.darknessLevel`
- **SceneConfig Namespace**: Updated to use `foundry.applications.sheets.SceneConfig`
- **UI Consistency**: Settings now use V13 fieldset and hint formatting
- **Hook System**: Replaced libWrapper approach with native `closeDocumentSheet` hook for better compatibility

### Breaking Changes from V12

- Requires Foundry VTT V13 (minimum build 13)
- Scene darkness values now stored in `environment.darknessLevel` path
- SceneConfig customization uses ApplicationV2 lifecycle hooks

## Install 

Install via the manifest url: https://github.com/KonteiKeisei/day-night-cycle/releases/latest/download/module.json

### Dependencies

- [Simple Calendar](https://github.com/vigoren/foundryvtt-simple-calendar) - Required for time tracking
- [lib-wrapper](https://github.com/ruipin/fvtt-lib-wrapper) - Required for module functionality

## Instructions

Default settings can be changed within the module settings.  

The activation and day night cycle can be controlled on a scene-by-scene basis within scene configure menu.

The effects of changing the settings can be seen [here](https://sdoehren.com/daynightcycle)

## Planned changes

- Seasonal Variation

## Change log

[Change log](Changelog.md)

### Licence

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.
