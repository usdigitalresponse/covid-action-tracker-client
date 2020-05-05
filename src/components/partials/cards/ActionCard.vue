<template>
    <div class="actionDetailCard" v-if="action">

        <div class="text-sub">Action Date</div>
        <div class="text-main mb-3">{{action.dateOfAction | date('M/D/YYYY')}}</div>

        <div class="text-sub">Action Type</div>
        <div class="text-main mb-3">{{action.actionTypes | arrayToString}}</div>

        <div class="text-sub">City, State (Population)</div>
        <div class="text-main mb-3" v-if="action.city">{{action.city}}, {{action.stateCode}} <span class="text-muted">({{action.population | number}})</span></div> 

        <div class="text-sub">Population Affected</div>
        <div class="text-main mb-3">{{action.populationImpacted | arrayToString}}</div>

        <div class="text-sub">Policy Area</div>
        <div class="text-main mb-3">{{action.policyAreas | arrayToString}}</div>

        <div class="text-sub">Policy Description</div>
        <div class="mb-1">
            {{action.description}}
        </div>
        <a v-if="isLink(action.reference)" :href="action.reference" target="_blank" class="text-main underline">Link to Text or Release</a>
        
        <div class="mt-3" v-if="canDownload">
            <download-actions-button :opts="{uuid: action.uuid}"></download-actions-button>
        </div>

    </div>
</template>

<script>

import Api from '@/api';
import DownloadActionsButton from '@/components/partials/buttons/DownloadActionsButton';

export default {
    name: 'action-card',  
    props: {
        action: {
            type: Object,
            default: null
        },
        canDownload: {
            type: Boolean,
            default: false
        }        
    },
    components: {
        DownloadActionsButton
    },
    data() {
        return {
            selectedAction: {}
        };
    },
    computed: {
    },     
    mounted(){
    },
    methods: {

        isLink(str){
            if (!str){
                return false;
            }
            return (str.search('http') !== -1);
        }
        
    }
};
</script>

<style lang="scss">

.actionDetailCard {

    cursor: pointer;
    box-sizing: border-box;
    //border: 1px solid #CCCCCC;
    background-color: rgba(250,250,250,0.5);    
    padding: 10px;
    
    //&:hover {
    //    background-color: rgba(255,255,255,0.8);  
    //}

    font-size: 12px;

    .text-sub {
        color: #7F7F7F;
        font-size: 9px;
        font-weight: normal;
        line-height: 14px;
        text-transform: uppercase;
    }

    .text-population {
        font-style: italic;
        font-weight: 300;
        line-height: 24px;        
    }

    .text-main {
        color: #000000;
        font-size: 12px;
        font-weight: bold;
        letter-spacing: 0;
        line-height: 14px;
    }


}
</style>

