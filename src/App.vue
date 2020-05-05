<style src="./styles/global.scss" lang="scss"></style>

<template>
    <div id="AppContainer" class="container-fluid p-0 pt-4">
        
        <!-- TOP METRICS ------>

        <top-metrics-card v-if="appView == 'top-metrics' || appView == 'all'"></top-metrics-card>
        
        <!-- TABLE & SEARCH BAR ------>

        <div v-if="appView == 'table' || appView == 'all'">
            <mq-layout :mq="['sm', 'md']">
                <mobile-search-bar :instanceId="uuid"></mobile-search-bar>
            </mq-layout>
            <mq-layout :mq="['lg', 'xl']">
                <search-bar :instanceId="uuid"></search-bar>
            </mq-layout>
            <action-table :instanceId="uuid" class="mb-4 tracker-section"></action-table>
        </div>

        <!-- MAP ------>

        <div v-if="appView == 'map' || appView == 'all'">

            <!--
            <div style="padding-left:87px">
                <h2>COVID-19 Action Tracker Map</h2>
            </div>
            -->

            <action-map :instanceId="uuid" class="mt-4 mb-5 tracker-section"></action-map>
        </div>

    </div>
</template>

<script>

import Api from '@/api';
import ActionTable from '@/components/widgets/ActionTable';
import ActionMap from '@/components/widgets/ActionMap';
import TopMetricsCard from '@/components/widgets/TopMetricsCard';
import SearchBar from '@/components/widgets/SearchBar';
import MobileSearchBar from '@/components/widgets/MobileSearchBar';
import {bus} from '@/utils/EventBus';
import Utils from '@/utils/Utils';

export default {
	name: 'App',
	components: {
        ActionTable,
        ActionMap,
        SearchBar,
        TopMetricsCard,
        MobileSearchBar
    },
    data() {
        return {
            appView: null,
            uuid: null,
        };
    },    
    computed: {
    },     
	async mounted(){
        this.uuid = Utils.guidGenerator();
        let attrs = Object.keys(this.$parent.$refs);
        this.appView = attrs[0];
	},    
    methods: {        
    } 
};
</script>

<style lang="scss">

#AppContainer {
    .tracker-section {
        /*
        margin-left: 15px;
        margin-right: 15px;
        */
    }
}

</style>

