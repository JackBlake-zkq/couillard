import { readable, derived, writable, get } from 'svelte/store';

import getData from './getData';
import { type PanelData } from './getData';

export const dbData = readable(getData());

export const LBS_CO2_PER_KWH = 1.52;
export const DOLLARS_SAVED_PER_KWH = 0.10;

export const selectedPanelStore = writable(null);


const TOTALS_PANEL_WHITELIST = null;

function calcTotal(data: { [key: string]: PanelData }, panelFilter: string) {
    let total = 0;
    for (const [panelName, xy] of Object.entries(data)) {
        if (TOTALS_PANEL_WHITELIST !== null) {
            if (!TOTALS_PANEL_WHITELIST.includes(panelName)) {
                continue;
            }
        }
        if(!panelFilter || panelFilter == panelName) {
            for (const output of xy.y) {
                total += +output;
            }
        }
    }
    return total;
}

//export const totalData = derived(dbData, promise => promise.then(data => calcTotal(data, get(selectedPanelStore))));
export const totalData = derived(
    [dbData, selectedPanelStore], 
    async ([$dbData, $selectedPanelStore]) => {
       return calcTotal(await $dbData, $selectedPanelStore);
    }
);