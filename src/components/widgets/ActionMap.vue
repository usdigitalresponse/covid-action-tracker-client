<template>
    <div id="ActionMap" style="height: 800px">
                
        <div class="row h-100">
            
            <div class="col-md-3 h-100 pr-2 d-none d-lg-block">

                <div class="action-list pr-2">

                    <span 
                        v-for="action in filteredDataList" 
                        :key="action.uuid" 
                        @click="onSelectAction(action)">
                        <action-brief-card 
                            :class="{'bg-white':selectedAction.uuid == action.uuid}"    
                            class="mb-2"                                            
                            :action="action">
                        </action-brief-card>         
                    </span>

                </div>
            </div>

            <div class="col-lg-9 col-md-12 col-sm-12 h-100 p-0">

                <div class="mapModal" v-if="showActionDialog">
                    
                    <button class="btn btn-link float-right" style="font-size:18px; color: black" @click="closeActionDialog()">
                        <b-icon-x-circle/>
                    </button>

                    <div v-if="selectedAction && selectedAction.uuid">
                        <action-card class="bg-white" :action="selectedAction" :canDownload="true"></action-card>
                    </div>

                    <div v-else-if="selectedActions && selectedActions.length > 0">

                        <!-- TABLE PAGING ------>

                        <div class="ml-2">
                            <span class="text-info">Action {{page+1}} of {{selectedActions.length}}</span>
                            <button type="button" class="btn btn-link text-info" @click="prevPage()" v-bind:class="{'disabled text-muted':page == 0}">
                                <b-icon icon="chevron-left"></b-icon>
                            </button>
                            <button type="button" class="btn btn-link text-info" @click="nextPage()" v-bind:class="{'disabled text-muted':page >= (selectedActions.length-1)}">
                                <b-icon icon="chevron-right"></b-icon>
                            </button>
                        </div>

                        <action-card v-if="selectedPagedAction" class="bg-white" :action="selectedPagedAction" :canDownload="false"></action-card>

                        <div class="mt-2 mb-2 ml-1">
                            <download-actions-button :opts="pagedActionsOptions"></download-actions-button>
                        </div>

                    </div>
                    
                </div>

                <gmap-map
                    v-if="geoDataList"
                    mapTypeId="terrain"
                    :center="{lat:39.8283, lng:-98.5795}"
                    :zoom="5"
                    @zoom_changed="onZoomChanged"
                    @bounds_changed="onBoundsChanged"
                    :options="{
                        //disableDefaultUI: true,
                        styles: mapStyle,
                        scrollwheel: false,
                        streetViewControl: false
                    }"
                    style="width: 100%; height: 100%"
                >
                
                    <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">

                    </gmap-info-window>
        <!--
                    <gmap-circle
                        v-for="(geo, index) in getGeoList()" :key="index"    
                        :center="{lat:geo.latitude, lng: geo.longitude}"
                        :options="{
                            strokeColor:'#F46F63',
                            strokeOpacity:0.8,
                            strokeWeight:1,
                            fillColor:'#f46f63',
                            fillOpacity:0.24              
                        }"
                        :radius="Math.sqrt(geo.population) * 100"/>
        -->

                        
                    <gmap-cluster v-if="1" @click="onSelectCluster" :maxZoom="7" :options="{maxZoom:1, minimumClusterSize:2, zoomOnClick:false}">

                        <span v-for="(geo, index) in dataSummaryList" :key="index">
                            <gmap-marker 
                                v-if="geo.latitude && geo.longitude"
                                :ref="geo.uuid"                            
                                :position="{lat:geo.latitude, lng: geo.longitude}"
                                :clickable="true" :draggable="false"
                                @click="onSelectAction(geo)"            
                            ></gmap-marker>
                        </span>

                    </gmap-cluster>

<!--
                    <span v-for="(geo, index) in geoDataList" :key="index">
                        <gmap-marker
                            v-if="geo.latitude && geo.longitude"      
                            :position="{lat:geo.latitude, lng: geo.longitude}"
                            :clickable="true"
                            :label="geo.count+''"
                            @click="onSelectStackedActions(geo)"  
                            :draggable="false"/>
                    </span>
                    -->


                </gmap-map>
                                
            </div>

        </div>
    </div>
</template>



<script>

import Api from '@/api';
import moment from 'moment';
import _ from 'lodash';
import GmapCluster from 'vue2-google-maps/dist/components/cluster';
import mapStyle from '@/components/partials/maps/themes/light-gray';
import ActionCard from '@/components/partials/cards/ActionCard';
import ActionBriefCard from '@/components/partials/cards/ActionBriefCard';
import Utils from '@/utils/Utils';
import DownloadActionsButton from '@/components/partials/buttons/DownloadActionsButton';

/**
 * Map options: @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
 */
export default {
    name: 'action-map',
    components: {
        GmapCluster,
        ActionBriefCard,
        ActionCard,
        DownloadActionsButton
    },
    data() {
        return {
            mapStyle: mapStyle,
            center: {
                lat: 47.376332,
                lng: 8.547511
            },
            page: 0,
            searchMeta: null,
            selectedPagedAction: null,
            pagedActionsOptions: {},
            selectedAction: {},
            selectedActions: null,
            action: null,
            infoWindowPos: null,
            infoWinOpen: false,
            currentMidx: null,
            infoOptions: {
                content: '',
                //optional: offset infowindow so it visually sits nicely on top of our marker
                pixelOffset: {
                    width: 0,
                    height: -35
                }
            },
            showActionDialog: false,
            bounds: {},
            dataSummaryList: null,
            geoDataList: null

        };
    },
    computed: {       
        filteredDataList(){

            /*
            if (this.bounds && this.bounds.southWest){
                let lon = [this.bounds.southWest.lng(), this.bounds.northEast.lng()];
                let lat = [this.bounds.southWest.lat(), this.bounds.northEast.lat()];
                opts.latitude = {min: _.min(lat), max: _.max(lat)};
                opts.longitude = {min: _.min(lon), max: _.max(lon)};
            }
            */      

            if (this.bounds && this.bounds.latitude && this.dataSummaryList){
                let list = [];

                for (let i=0; i<this.dataSummaryList.length; i+=1){
                    let action = this.dataSummaryList[i];
                    if (action.latitude >= this.bounds.latitude.min && action.latitude <= this.bounds.latitude.max
                        && action.longitude >= this.bounds.longitude.min && action.longitude <= this.bounds.longitude.max){
                            list.push(action);
                    }
                }

                return list;
            }

            return this.dataSummaryList;

        }
    },    
    async mounted(){
        this.getGeoData();
    },
    methods: {

        async onSelectCluster(info){

            this.$log('CLUSTER: ', Object.keys(info),  Object.keys(info.bounds_))

            this.showActionDialog = true;
            this.page = 0;

            let lats = [];
            let lons = [];

            for (let i=0; i<info.markers_.length; i+=1){
                lats.push(info.markers_[i].position.lat());
                lons.push(info.markers_[i].position.lng());
            }

            this.$log(info.markers_)

            let lat = {min: _.min(lats), max: _.max(lats)};
            let lon = {min: _.min(lons), max: _.max(lons)};

            let opts = {
                limit: 500,
                skip: 0,
                longitude: lon,
                latitude: lat
            }

            let res = await Api().post(`data/search`, Utils.getSearchQueryParams(opts, this.searchFilters));
            //this.searchMeta = res.data.meta;
            this.selectedActions = res.data.results;

            this.selectedPagedAction = this.selectedActions[0];
            this.pagedActionsOptions = {
                filters: {
                    checkedActions: this.selectedActions
                }
            }

        },


        prevPage() {
            if (this.page > 0) {
                this.page -= 1;
            }
            this.selectedPagedAction = this.selectedActions[this.page];
        },

        nextPage() {
            if (this.page < this.selectedActions.length-1) {
                this.page += 1;
            }
            this.selectedPagedAction = this.selectedActions[this.page];
        },

        async onSelectAction(action){
            
            this.selectedActions = null;

            if (this.selectedAction && this.selectedAction.uuid == action.uuid){
                // no change
                return
            }

            this.showActionDialog = true;
            this.selectedAction = action;
            let res = await Api().get(`action/${action.uuid}`);
            this.selectedAction = res.data;
        },


        onZoomChanged(info){
            //this.$log(`Zoom changed`, info);
        },

		onBoundsChanged: _.debounce(function(map){
            
            this.bounds = {
                southWest: map.getSouthWest(),
                northEast:  map.getNorthEast()
            }

            if (this.bounds && this.bounds.southWest){
                let lon = [this.bounds.southWest.lng(), this.bounds.northEast.lng()];
                let lat = [this.bounds.southWest.lat(), this.bounds.northEast.lat()];
                this.bounds.latitude = {min: _.min(lat), max: _.max(lat)};
                this.bounds.longitude = {min: _.min(lon), max: _.max(lon)};
            }

            //this.getData();
        }, 500),
        

        toggleInfoWindow(geo, index) {

            this.infoWindowPos = {lat:geo.latitude, lng: geo.longitude};
            this.infoOptions.content = geo.cohorts.join(', ');

            //check if its the same marker that was selected if yes toggle
            if (this.currentMidx == index) {
                this.infoWinOpen = !this.infoWinOpen;
            }

            //if different marker set infowindow to open and reset current marker index
            else {
                this.infoWinOpen = true;
                this.currentMidx = index;
            }
        },

        closeActionDialog(){
            this.showActionDialog = false;
        },

        async onSelectStackedActions(stack){

            if (!stack){
                return;
            }
            
            this.showActionDialog = true;

            if (stack.uuids.length == 1){
                return this.onSelectAction({uuid:stack.uuids[0]});
            }
            
            this.selectedActions = [];

            for (let i=0; i<stack.uuids.length; i+=1){
                let res = await Api().get(`action/${stack.uuids[i]}`);
                this.selectedActions.push(res.data); 
            }


            //this.selectedAction = null;

        },




        async getGeoData() {

            let params = {
                filters: this.searchFilters,
                limit: 99999999999,
                skip: 0,                
                projection: ['uuid', 'dateOfAction', 'city', 'stateCode', 'population', 'actionTypes', 'latitude', 'longitude'].join(',')
            }

            /*
            var queryString = Object.keys(params).map(function(key) {

                window.dataLayer = window.dataLayer || []; 

                if (typeof params[key] == 'object'){
                    window.dataLayer.push({ key: JSON.stringify(params[key]) }); 
                    return key + '=' + JSON.stringify(params[key]);
                }
                else {
                    window.dataLayer.push({ key: params[key] }); 
                    return key + '=' + params[key];
                }


            }).join('&');    
            */  
            
            // Get geo data (data grouped by city)

            console.log('Searching with options; ', params);

            // Get a summary list with top level info

            let res = await Api().post(`data/search`, params);
            this.dataSummaryList = res.data.results;

            let res2 = await Api().post(`data/geo/search`, params);
            this.geoDataList = res2.data;
            
            window.dataLayer = window.dataLayer || []; 
            window.dataLayer.push({
                'event': 'gtm_event_actiontable_search_updated'  
            });

        }

    }
};
</script>

<style lang="scss">

#ActionMap {

    .mapModal {
        height: auto;
        background-color: white;
        position: absolute;
        z-index: 100;
        max-width: 80vw;
        width: 400px;
        top: 20px;
        left: 25px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    .action-list {
        max-height: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }

}
</style>

