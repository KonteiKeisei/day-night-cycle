import {registerSettings} from './settings.js';

'use strict';

Hooks.once('init', async () => {
    console.log('day-night-cycle | Initializing day-night-cycle');
    registerSettings();
});

function DEBUG(message){
    if (game.settings.get("day-night-cycle",'Debug')) {
        console.log(message);
    }
}

Hooks.on("ready", () => {

    if (game.settings.get("day-night-cycle", "first-load") && game.user.isGM){
        let message = "Hi,<br>Thanks for installing Day Night Cycle<br>" +
            "I recommend you goto<br>" +
            "https://sdoehren.com/daynightcycle<br>" +
            "before you make any changes to the default settings.<br>" +
            "This message will not be shown again.<br><br>" +
            "All the best,<br>SDoehren<br>Discord Server: https://discord.gg/QNQZwGGxuN"
        ChatMessage.create({whisper:ChatMessage.getWhisperRecipients("GM"),content: message,speaker:ChatMessage.getSpeaker({alias: "Day Night Cycle"})}, {});
        game.settings.set("day-night-cycle", "first-load",false)
    }

    let CURRENTMESSAGE = 1;
    if (game.settings.get("day-night-cycle", "message-number")<CURRENTMESSAGE && game.user.isGM){
        let message = "Hi,<br>Thanks for updating Day Night Cycle<br>" +
            "Please note that the Moon Effects are only available when the game language is set to English.<br><br>" +
            "This message will not be shown again.<br><br>" +
            "All the best,<br>SDoehren<br>Discord Server: https://discord.gg/QNQZwGGxuN"
        ChatMessage.create({whisper:ChatMessage.getWhisperRecipients("GM"),content: message,speaker:ChatMessage.getSpeaker({alias: "Day Night Cycle"})}, {});
        game.settings.set("day-night-cycle", "message-number",CURRENTMESSAGE)
    }


    console.log('day-night-cycle | Ready');
});


Hooks.on("renderSceneConfig", (sheet, html, data) => {

    let sceneDoc = sheet.document || sheet.object;
    if (!sceneDoc) return;

    // Wrap html in jQuery if needed for V13 ApplicationV2 compatibility
    const $html = html instanceof jQuery ? html : $(html);

    // Check if we've already added our fields to prevent duplicates
    // Check both the element itself and within it
    if ($html.hasClass('dnc-injected') || $html.find('.day-night-cycle-settings').length > 0) {
        console.log("Day Night Cycle: Fields already injected, skipping");
        return;
    }
    $html.addClass('dnc-injected');
    
    let DNCflags = sceneDoc.flags["day-night-cycle"]
    let currentactiveflag;
    let activechecked;
    let defaultchecked;
    let sd;
    let stepsize;
    let moonstrength;
    let moononchecked;
    let MaxLight;

    if (DNCflags===undefined){
        sceneDoc.setFlag("day-night-cycle", "active", game.settings.get("day-night-cycle", "default-on"))
        if (game.settings.get("day-night-cycle", "default-on")){
            activechecked = "checked";
        } else {
            activechecked = "";
        }

        if (game.settings.get("day-night-cycle", "moonon")){
            moononchecked = "checked";
        } else {
            moononchecked = "";
        }

        defaultchecked = "checked";

        sd = game.settings.get("day-night-cycle", "sd");
        stepsize = game.settings.get("day-night-cycle", "stepsize");
        moonstrength = game.settings.get("day-night-cycle", "moonstrength");
        MaxLight = game.settings.get("day-night-cycle", "MaxLight");



    } else {
        currentactiveflag = DNCflags.active;
        if (currentactiveflag === undefined) {
            currentactiveflag = game.settings.get("day-night-cycle", "default-on")
        } else {
            currentactiveflag = currentactiveflag === true
        }
        activechecked = "";
        if (currentactiveflag) {
            activechecked = "checked"
        }

        let currentdefaultflag = DNCflags.default;
        defaultchecked = "";
        let moononflag = DNCflags.moonon;
        moononchecked = "";

        if (currentdefaultflag === true || currentdefaultflag === undefined) {
            defaultchecked = "checked";
        }

        if (moononflag === true || moononflag === undefined) {
            moononchecked = "checked";
        }


        if (currentdefaultflag === true || currentdefaultflag === undefined) {
            sd = game.settings.get("day-night-cycle", "sd")
            stepsize = game.settings.get("day-night-cycle", "stepsize")
            moonstrength = game.settings.get("day-night-cycle", "moonstrength")
            MaxLight = game.settings.get("day-night-cycle", "MaxLight")
        } else {
            let currentsdflag = DNCflags.sd;
            if (currentsdflag === undefined) {
                sd = game.settings.get("day-night-cycle", "sd")
                stepsize = game.settings.get("day-night-cycle", "stepsize")
                moonstrength = game.settings.get("day-night-cycle", "moonstrength")
                MaxLight = game.settings.get("day-night-cycle", "MaxLight")
            } else {
                sd = DNCflags.sd
                stepsize = DNCflags.stepsize
                moonstrength = DNCflags.moonstrength
                MaxLight = DNCflags.MaxLight
            }
        }
    }




    // Try to find a good location to insert the fields in V13's new structure
    // We want to insert AFTER the lighting fieldset, not inside it
    let lightingTab = $html.find('[data-tab="lighting"]');
    let insertAfter = null;
    
    if (lightingTab.length > 0) {
        // Find the last fieldset in the lighting tab and insert after it
        insertAfter = lightingTab.find('fieldset').last();
    }
    
    if (!insertAfter || insertAfter.length === 0) {
        // Fallback: try to find darkness level lock
        insertAfter = $html.find('input[name="environment.darknessLevelLock"]').closest('.form-group');
    }
    
    if (!insertAfter || insertAfter.length === 0) {
        // Another fallback
        insertAfter = $html.find('input[name="environment.darknessLevel"]').closest('fieldset');
    }

    if (insertAfter.length > 0) {
        insertAfter.after(`\
<fieldset class="day-night-cycle-settings">
    <legend>Day Night Cycle</legend>
    <div class="form-group">
        <label class="checkbox">
            <input type="checkbox" id="flags.day-night-cycle.active" name="flags.day-night-cycle.active" ` + activechecked + `>
            <span>Enable Day Night Cycle</span>
        </label>
        <p class="hint">Turns on the Day Night Cycle for this scene.</p>
    </div>

    <div class="form-group">
        <label class="checkbox">
            <input type="checkbox" id="flags.day-night-cycle.default" name="flags.day-night-cycle.default" ` + defaultchecked + `>
            <span>Use Default Settings</span>
        </label>
        <p class="hint">If ticked the following Day Night Cycle settings will be ignored.</p>
    </div>

    <div class="form-group">
        <label>Day Length Metric</label>
        <div class="form-fields">
            <input type="number" name="flags.day-night-cycle.sd" min="0.01" value="`+sd+`" step="0.01" data-dtype="Number">
        </div>
        <p class="hint">Smaller numbers give longer nights.</p>
    </div>

    <div class="form-group">
        <label>Lighting Step Size</label>
        <div class="form-fields">
            <input type="number" name="flags.day-night-cycle.stepsize" min="0.001" value="`+stepsize+`" step="0.001" data-dtype="Number">
        </div>
        <p class="hint">Size of jumps when adjusting light levels - High number bigger jumps but less often.</p>
    </div>

    <div class="form-group">
        <label class="checkbox">
            <input type="checkbox" id="flags.day-night-cycle.moonon" name="flags.day-night-cycle.moonon" ` + moononchecked + `>
            <span>Moons effect lighting</span>
        </label>
        <p class="hint">Turns on moon effects for this scene.</p>
    </div>

    <div class="form-group">
        <label>Moon Brightness at Full Moon</label>
        <div class="form-fields">
            <input type="number" name="flags.day-night-cycle.moonstrength" min="0.01" max="1.00" value="`+moonstrength+`" step="0.01" data-dtype="Number">
        </div>
        <p class="hint">The strength of light from each moon on a full moon at midnight.</p>
    </div>

    <div class="form-group">
        <label>Max Brightness for Scene</label>
        <div class="form-fields">
            <input type="number" name="flags.day-night-cycle.MaxLight" min="0.01" max="1.00" value="`+MaxLight+`" step="0.01" data-dtype="Number">
        </div>
        <p class="hint">For worlds that do not reach full light.</p>
    </div>
</fieldset>
`);
    } else {
        console.warn("Day Night Cycle: Could not find suitable location to insert scene config fields");
    }

})


Hooks.once("canvasReady",async (canvas)=>{
    let scenedataobj = canvas.scene


    let DNCflags = scenedataobj.flags["day-night-cycle"]
    if (DNCflags === undefined){
        console.log('day-night-cycle | setting flags');
        canvas.scene.setFlag("day-night-cycle", "active", game.settings.get("day-night-cycle", "default-on"))
        canvas.scene.setFlag("day-night-cycle", "sd", game.settings.get("day-night-cycle", "sd"))
        canvas.scene.setFlag("day-night-cycle", "stepsize", game.settings.get("day-night-cycle", "stepsize"))
        canvas.scene.setFlag("day-night-cycle", "default", true)
        canvas.scene.setFlag("day-night-cycle", "moonon", game.settings.get("day-night-cycle", "moonon"))
        canvas.scene.setFlag("day-night-cycle", "moonstrength", game.settings.get("day-night-cycle", "moonstrength"))
        canvas.scene.setFlag("day-night-cycle", "MaxLight", game.settings.get("day-night-cycle", "MaxLight"))
        return;
    }

    let currentactiveflag = DNCflags.active;
    let sd = DNCflags.sd;
    let stepsize= DNCflags.stepsize;
    let defaultmode= DNCflags.default;
    let moonon= DNCflags.moonon;
    let moonstrength= DNCflags.moonstrength;

    if (currentactiveflag === undefined){
        console.log('day-night-cycle | setting active flag');
        canvas.scene.setFlag("day-night-cycle", "active", game.settings.get("day-night-cycle", "default-on"))
    }

    if (sd === undefined){
        console.log('day-night-cycle | setting sd flag');
        canvas.scene.setFlag("day-night-cycle", "sd", game.settings.get("day-night-cycle", "sd"))
    }

    if (stepsize === undefined){
        console.log('day-night-cycle | setting stepsize flag');
        canvas.scene.setFlag("day-night-cycle", "stepsize", game.settings.get("day-night-cycle", "stepsize"))
    }

    if (defaultmode === undefined){
        console.log('day-night-cycle | setting default flag');
        canvas.scene.setFlag("day-night-cycle", "default", true)
    }

    if (moonon === undefined){
        console.log('day-night-cycle | setting moonon flag');
        canvas.scene.setFlag("day-night-cycle", "moonon", game.settings.get("day-night-cycle", "moonon"))
    }

    if (moonstrength === undefined){
        console.log('day-night-cycle | setting moonstrength flag');
        canvas.scene.setFlag("day-night-cycle", "moonstrength", game.settings.get("day-night-cycle", "moonstrength"))
    }

    if (moonstrength === undefined){
        console.log('day-night-cycle | setting MaxLight flag');
        canvas.scene.setFlag("day-night-cycle", "MaxLight", game.settings.get("day-night-cycle", "MaxLight"))
    }
})

function updatelighting(sceneid,timestamp){
    let sceneobj = game.scenes.get(sceneid);
    let scenedataobj = sceneobj

    DEBUG("DNC Active",scenedataobj.flags["day-night-cycle"].active)
    if (!scenedataobj.flags["day-night-cycle"].active){return;}

    let sceneflags = scenedataobj.flags["day-night-cycle"];

    DEBUG("DNC Scene Flags",sceneflags)

    let mean = 0.5;
    let sd = sceneflags.sd;
    let definition = sceneflags.stepsize;

    if (sd===undefined){sd = game.settings.get("day-night-cycle", "sd")}
    if (definition===undefined){definition = game.settings.get("day-night-cycle", "stepsize")}

    let hoursinday = SimpleCalendar.api.getTimeConfiguration().hoursInDay;
    let minutesinhour = SimpleCalendar.api.getTimeConfiguration().minutesInHour;

    let lastS = 1 - scenedataobj.environment.darknessLevel;
    let visioncutoff = 1 - (scenedataobj.environment.globalLight?.darkness?.max ?? 1);

    function score(sd, mean, X) {
        return (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * (((X - mean) / sd) ** 2))
    }

    const minscore = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * (((0 - mean) / sd) ** 2))
    const maxscore = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * (((0.5 - mean) / sd) ** 2))
    const divisor = maxscore - minscore

    let MaxLight = sceneflags.MaxLight
    if (MaxLight===undefined){MaxLight = game.settings.get("day-night-cycle", "MaxLight")}

    let dt = SimpleCalendar.api.timestampToDate(timestamp)
    let s = ((score(sd, mean, (dt.hour * minutesinhour + dt.minute) / (hoursinday * minutesinhour)) - minscore) / divisor);
    s = s*MaxLight

    let Moonvalues;
    if (((dt.hour * minutesinhour + dt.minute) / (hoursinday * minutesinhour)) - minscore > 0.5){
        Moonvalues = SimpleCalendar.api.getAllMoons().map(x=>x.currentPhase.name)
        game.settings.set("day-night-cycle", "currentmoonphases", JSON.stringify(Moonvalues))
    } else {
        Moonvalues = JSON.parse(game.settings.get("day-night-cycle", "currentmoonphases"));
    }

    if (Object.keys(Moonvalues).length === 0){
        Moonvalues = SimpleCalendar.api.getAllMoons().map(x=>x.currentPhase.name)
        game.settings.set("day-night-cycle", "currentmoonphases", JSON.stringify(Moonvalues))
    }


    let steppedS;
    let update = true;
    if (s < definition) {
        steppedS = 0
    } else if (1 - s < definition) {
        steppedS = 1
    }  else if (lastS < visioncutoff && s >= visioncutoff) {
        steppedS = s
    } else if (lastS > visioncutoff && s <= visioncutoff) {
        steppedS = s
    } else if (Math.abs(s - lastS) < definition) {
        update = false
    } else {
        steppedS = Math.round(s / definition) * definition
        if (s - lastS > 0) {
            steppedS += definition / 2
        } else {
            steppedS -= definition / 2
        }
    }

    if (steppedS > visioncutoff && s <= visioncutoff) {
        steppedS = parseFloat(visioncutoff) - 0.001
    } else if (steppedS < visioncutoff && s >= visioncutoff) {
        steppedS = parseFloat(visioncutoff) + 0.001
    }

    if (Math.abs(steppedS - lastS) === 0) {
        update = false
    }

    let dark = 1 - steppedS
    DEBUG(["Darkness Level: ",dark])

    let MoonStages = {"New Moon":0.0, "Waxing Crescent":0.25, "First Quarter":0.50, "Waxing Gibbous":0.75,
        "Full Moon":1.0, "Waning Gibbous":0.75, "Last Quarter":0.50, "Waning Crescent":0.25}

    Moonvalues= Moonvalues.map(x=>MoonStages[x])
    let moonmax = sceneflags.moonstrength
    if (moonmax===undefined){moonmax = game.settings.get("day-night-cycle", "moonstrength")}
    let combinedbrightness = Moonvalues.reduce((a, b) => a + b, 0)
    let finalmoonbrightness = combinedbrightness*(dark*moonmax)

    if (!isNaN(finalmoonbrightness)) {
        dark = dark - finalmoonbrightness
    }

    if (dark<0){dark=0}
    if (dark>1){dark=1}

    if (update) {
        DEBUG("Updated Scene Lighting ",true)
        Hooks.call("day-night-cycle-darknessupdated", [sceneid,dark]);
        sceneobj.update({"environment.darknessLevel": dark}, {animateDarkness: 500});
    } else {
        DEBUG("Updated Scene Lighting ",false)
    }
}

Hooks.on('updateWorldTime', async (timestamp,stepsize) => {
    if (stepsize > 0 && game.user.isGM) {
        let currentlyviewedscenes = game.users.filter(x => x.viewedScene !== null).map(x => x.viewedScene);
        if (game.scenes.active) {
            currentlyviewedscenes.push(game.scenes.active.id)
        }
        currentlyviewedscenes = [...new Set(currentlyviewedscenes)]

        for (let i = 0; i < currentlyviewedscenes.length; i++) {
            DEBUG("Updating Lighting on Scene:", currentlyviewedscenes[i])
            updatelighting(currentlyviewedscenes[i], timestamp)
        }
    }
})