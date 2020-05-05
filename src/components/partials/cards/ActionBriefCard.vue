<template>
    <div class="actionBriefCard">

        <div class="text-sub">Action Date</div>
        <div class="text-main mb-3">{{action.dateOfAction | date('MMM DD, YYYY')}}</div>

        <div class="text-sub">Action Type</div>
        <div class="text-main mb-3">{{action.actionTypes | arrayToString}}</div>

        <div class="text-sub">City, State (Population)</div>
        <div class="text-main" v-if="action.city">{{action.city}}, {{action.stateCode}} <span class="text-muted">({{action.population | number}})</span></div> 


    </div>
</template>

<script>

import Api from '@/api';

export default {
    name: 'action-brief-card',
    props: ['action'],
    components: {
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


        
    }
};
</script>

<style lang="scss">

.actionBriefCard {

    cursor: pointer;
    box-sizing: border-box;
    border: 1px solid #CCCCCC;
    background-color: rgba(223,222,222,0.5);    
    padding: 10px;

    
    &:hover {
        background-color: rgba(223,222,222,0.9);
    }

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

