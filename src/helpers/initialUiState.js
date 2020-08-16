import keplerGlReducer, {uiStateUpdaters} from "kepler.gl/reducers";

export const customizedKeplerGlReducer = keplerGlReducer
    .initialState({
        uiState: {
            // hide side panel to disallower user customize the map
            readOnly: false,

            // customize which map control button to show
            mapControls: {
                ...uiStateUpdaters.DEFAULT_MAP_CONTROLS,
                visibleLayers: {
                    show: false
                },
                mapLegend: {
                    show: true,
                    active: true
                },
                toggle3d: {
                    show: true
                },
                splitMap: {
                    show: false
                },
                mapDraw: {
                    show: false,
                    active: false
                }
            }
        }
    })
    // handle additional actions
    .plugin({
        HIDE_AND_SHOW_SIDE_PANEL: (state, action) => ({
            ...state,
            uiState: {
                ...state.uiState,
                readOnly: !state.uiState.readOnly
            }
        })
    });