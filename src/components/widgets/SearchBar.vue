<template>
    <div id="SearchPage">
        
        <!-- PAGING BAR ------>

        <div class="main-bar main-paging-bar mt-0">

            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <span class="nav-link active">
                        FILTERS 
                    </span>
                </li>
                <li class="nav-item">
                    <span class="nav-link" @click="onResetFilters()">RESET FILTERS</span>
                </li>
            </ul>

        </div>

        <!-- SEARCH BAR ------>

        <div class="row main-bar main-search-bar ml-0 mr-0 align-items-end" v-if="showFilters">        

            <div class="col">
                <label>From Date</label>
                <b-form-datepicker @input="isDirty('date')" v-model="searchFilters.fromDate" :value-as-date="true" class="date-picker" placeholder="Select" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"></b-form-datepicker>
            </div>

            <div class="col">
                <label>To Date</label>
                <b-form-datepicker @input="isDirty('date')" v-model="searchFilters.toDate" :value-as-date="true" class="date-picker" placeholder="Select" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"></b-form-datepicker>
            </div>

            <div class="col" v-if="actionTypes">
                <label>Action Type</label>
                <filter-selector v-model="searchFilters.actionTypes" :options="actionTypes" @onChange="isDirty('actionTypes')" placeholder="Search"></filter-selector>
            </div>

            <div class="col" v-if="states">
                <label>Location</label>
                <filter-selector v-model="searchFilters.states" :options="states" @onChange="isDirty('states')"  placeholder="Search"></filter-selector>
            </div>

            <div class="col" v-if="populations">
                <label>Cohort Affected</label>
                <filter-selector v-model="searchFilters.populations" :options="populations" @onChange="isDirty('populations')" :label="null" placeholder="Search"></filter-selector>
            </div>

            <div class="col">
                <label>City Population</label>
                <single-selector v-model="searchFilters.populationRange" :options="populationRanges" @onChange="isDirty('populationRange')" :label="'text'" placeholder="Select"></single-selector>
            </div>

            <div class="col" v-if="policyAreas">
                <label>Policy Area</label>
                <filter-selector v-model="searchFilters.policyAreas" right :options="policyAreas" @onChange="isDirty('policyAreas')" :label="null" placeholder="Search"></filter-selector>
            </div>


        </div>  

        <!-- BUTTON BAR TABLE ------>

        <div class="row mb-4 main-bar main-button-bar">   

            <div class="col-md-8">

                <a class="btn btn-light btn-tracker" href="https://airtable.com/shreFb5JKWpfEugjG" target="_blank">
                    <add-icon/>
                    Add Action
                </a>

                <download-actions-button :opts="{filters: searchFilters}"></download-actions-button>

                <button class="btn btn-light btn-tracker" @click="onResetFilters()">
                    <reset-icon/>
                    Reset
                </button>

            </div>

            <div class="col-md-4" align="right">

                <div class="input-group search-input-wrapper mb-3">

                    <b-form-input class="search-input rounded-sm" v-model="searchFilters.searchText" placeholder="Search" v-on:keyup.13="isDirty('searchText')"></b-form-input>

                    <!--
                    <input type="text" class="form-control search-input rounded-sm" v-model="searchFilters.searchText"  placeholder="Search" v-on:keyup.13="isDirty('searchText')" aria-label="Recipient's username" aria-describedby="basic-addon2">
                    -->
                    <div class="input-group-append">
                        <button class="btn btn-search rounded-sm px-3" @click="isDirty('searchText')" type="button" id="button-addon2"><b-icon-search/></button>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>



<script>

import Api from '@/api';
import moment from 'moment';
import FilterSelector from '@/components/partials/selectors/FilterSelector';
import SingleSelector from '@/components/partials/selectors/SingleSelector';
import {bus} from '@/utils/EventBus';
import DownloadActionsButton from '@/components/partials/buttons/DownloadActionsButton';
import ResetIcon from '@/components/partials/svg/ResetIcon';
import AddIcon from '@/components/partials/svg/AddIcon';

export default {
    name: 'search-bar',
    components: {
        FilterSelector,
        DownloadActionsButton,
        SingleSelector,
        ResetIcon,
        AddIcon
    },
    props: ['instanceId'],
    data() {
        return {
            showFilters: true,
            tab: 'table',
            populationRanges: [
                {text: '<30K', min: 0, max: 29999},
                {text: '30K to 100K', min: 30000, max: 99999},
                {text: '100K to 500K', min: 100000, max: 499999},
                {text: '500K to 1M', min: 500000, max: 999999},
                {text: '1M+', min: 1000000, max: 99999999999},
            ],
            searchFilters: {
                //toDate: moment().format('YYYY-MM-DD'),
                //fromDate: moment().subtract(1, 'month').format('YYYY-MM-DD')                
            },            
            actionTypes: null,
            policyAreas: null,
            cities: null,
            states: null,
            populations: null,
            entities: null,
            categories: null,
            dateLatest: null,
            dateOldest: null
        };
    },    
    async mounted(){
        this.getMeta();
        this.isDirty();
    },
    methods: {

        dateFormatter(date){
            return moment(date).format('MM/DD/YYYY');
        },
        
        onResetFilters(){
            this.searchFilters = {};
            //bus.$emit(`actiontracker_${this.instanceId}.reset`);
            this.$nextTick(()=>{
                bus.$emit(`actiontracker_${this.instanceId}.reset`, this.searchFilters);
            })            
        },

        isDirty(field){

            console.log(`IS DIRTY: ${field} = `, this.searchFilters[field]);

            if (field==='searchText') {

                window.dataLayer = window.dataLayer || [];
                let searchQuery = this.searchFilters.searchText

                window.dataLayer.push({
                    "siteSearchTerm": field,
                    "eventCategory": "site search form interaction",
                    "eventAction": "site search form interaction",
                    "eventLabel": "search text: " + searchQuery,
                    "eventValue": 0,
                    "eventNonInteractive": false,
                    "pageVirtual":  location.pathname + "?s=" + field,
                    "event": "gtm_event_siteSearchTextBox"
                });
                window.dataLayer.push({
                    "pageVirtual":  location.pathname + "?s=" + field,
                    "event": "gtm_pageview_siteSearchTextBox"
                });
                console.log("GTM msg: searchText: " + searchQuery);
            }

            this.searchFilters.defaultSort = null;                
            if (field == 'date'){
                this.searchFilters.defaultSort = 'dateOfAction';                
            }
            else if (field == 'states'){
                this.searchFilters.defaultSort = 'city';                
            }

            // Let anyone who cares know that search options have changed
            this.$nextTick(()=>{
                bus.$emit(`actiontracker_${this.instanceId}.search-change`, this.searchFilters);
            })
        },

        async getMeta(){

            // Get data meta info
            let dataMeta = await Api().get('meta'); 

            this.actionTypes = dataMeta.data.actionTypes;
            this.policyAreas = dataMeta.data.policyAreas;
            this.cities = dataMeta.data.cities;
            this.states = dataMeta.data.states;
            this.populations = dataMeta.data.populations;
            this.entities = dataMeta.data.entities;
            this.categories = dataMeta.data.categories;
            this.dateLatest = dataMeta.data.dateLatest;
            this.dateOldest = dataMeta.data.dateOldest;

            //this.totalPeopleImpacted = dataMeta.data.totalPeopleImpacted;
            //this.numberCities = dataMeta.data.numberCities;
            //this.numberPolicies = dataMeta.data.numberPolicies;

        }        
        
    }
};
</script>

<style lang="scss">

#SearchPage {
    
    // Override WP
    li::before {
        content: none !important;
    }

    li {
        line-height: 1.3em !important;
    }

    .main-bar {
        padding-right: 70px;         
        padding-left: 70px;         
    }

    .main-paging-bar {
        
        background-color: white;
        border-top: 1px solid #DFDEDE;
        border-bottom: 3px solid #26BBE3;
        padding-top: 15px;
        padding-left: 70px;
        margin-top: 50px;
        margin-bottom: 2px;
        //height: 40px;        

        .nav {

            border: none;

            .nav-link {
                margin: 2px;
            }

            .nav-item {

                height: 30px;
                font-size: 12px;
                font-weight: 500;
                letter-spacing: 0;
                line-height: 1em;
                color: #26BBE3;
                margin-bottom: -3px;

                .active {
                    border-radius: 2px;
                    border: none;
                    width: 174px;
                    color: white;
                    background-color: #26BBE3;
                }

            }

        }
    }

    .main-button-bar {

        background-color: rgba(255,255,255,0.9);
        padding-top: 10px;      
        margin-bottom: 0px;

        .btn-search {
            background-color: #26BBE3;
            color: white;
            margin-left: 5px;
            border-radius: 0;
        }

        .search-input-wrapper {
            max-width: 255px;
        }

        .search-input {
            background-color: rgba(127,127,127,0.15);
            border-radius: 0;
        }

        input {
            font-size: 14px;
        }

    }

    .main-search-bar {

        background-color: rgba(127,127,127,0.6);
        padding-top: 3px;
        padding-bottom: 20px;

        .date-picker {
            label {
                color: black;
                font-size: 14px;
                padding-bottom: 6px;
                padding-top: 10px;

            }
        }

        /*    
        .multiselect.is-invalid {
            .multiselect-tags {
                border-color: red;
            }
        }
        
        .multiselect {
            height: 36px;
        }
        
        .multiselect__tags {
            // border-color: rgb(206, 212, 218) !important;
            min-height: 36px !important;
        }
        */
        

        .multiselect, .multiselect__placeholder, .multiselect__tag, input {
            font-size: 12px;
            font-weight: 300;
            letter-spacing: 0;
            line-height: 14px;                
        }

        input {

            height: 34px;
            background-color: white;
            color: black;
            border-color: transparent;

            &::placeholder {
                color: black !important;
            }
                
        }

        .date-picker-wrapper {
            width: 50px;
        }

        .date-picker {

        }

        label {
            color: #FFFFFF;
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0;
            line-height: 14px;
            margin-bottom: 0px;
        }

    }

}
</style>

