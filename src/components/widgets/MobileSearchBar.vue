<template>
    <div id="MobileSearchPage">


        <!-- SEARCH BAR ------>


        <b-nav class="main-search-bar m-0" justified>

            <b-nav-item>
                <b-button variant="btn btn-info text-white" @click="showFilter = !showFilter; showSearch = false;">
                    <b-icon-funnel></b-icon-funnel> Filter
                    <span style="font-size: 0.7em">
                        <b-icon-caret-up-fill v-if="!showFilter"/>
                        <b-icon-caret-down-fill v-else/>
                    </span>
                </b-button>

            </b-nav-item>

            <b-nav-item active>
                <b-button variant="btn btn-info text-white" @click="showSearch = !showSearch; showFilter = false;">
                    <b-icon-search></b-icon-search>
                    Search
                    <span style="font-size: 0.7em">
                        <b-icon-caret-up-fill v-if="!showSearch"/>
                        <b-icon-caret-down-fill v-else/>
                    </span>                    
                </b-button>
            </b-nav-item>

            <b-nav-item>
                <b-dropdown id="dropdown-1" text="More" variant="btn btn-info text-white" right no-caret>

                    <template v-slot:button-content>
                        <b-icon-three-dots></b-icon-three-dots>
                    </template>

                    <b-dropdown-item>
                        <b-dropdown-item @click="onResetFilters()">Reset</b-dropdown-item>    
                        <b-dropdown-divider></b-dropdown-divider>                    
                        <b-dropdown-item @click="onAddAction()">Add Action</b-dropdown-item>                        
                    </b-dropdown-item>
                </b-dropdown>
            </b-nav-item>

        </b-nav>

        <!-- Filter BAR ------>

        <div class="main-filter-bar">
            
            <div v-if="showFilter" class="pl-2 pr-2 pb-4">

                <div class="form-group">
                    <label>From Date</label>
                    <b-form-datepicker 
                        @input="isDirty('date')" 
                        v-model="searchFilters.fromDate" 
                        :value-as-date="true" 
                        class="date-picker" 
                        placeholder="From Date" 
                        :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }">
                    </b-form-datepicker>
                </div>

                <div class="form-group"> 
                    <label>To Date</label>
                    <b-form-datepicker 
                        @input="isDirty('date')" 
                        v-model="searchFilters.toDate" 
                        :value-as-date="true" 
                        class="date-picker" 
                        right
                        placeholder="To Date" 
                        :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }">
                    </b-form-datepicker>
                </div>

                <div class="form-group" v-if="actionTypes">
                    <label>Action Type</label>
                    <filter-selector v-model="searchFilters.actionTypes" :options="actionTypes" @onChange="isDirty('actionTypes')" placeholder="Search"></filter-selector>
                </div>

                <div class="form-group" v-if="states">
                    <label>Location</label>
                    <filter-selector v-model="searchFilters.states" :options="states" @onChange="isDirty('states')"  placeholder="Search"></filter-selector>
                </div>

                <div class="form-group">
                    <label>Cohort Affected</label>
                    <filter-selector v-model="searchFilters.populations" :options="populations" @onChange="isDirty('populations')" :label="null" placeholder="Search"></filter-selector>
                </div>

                <div class="form-group">
                    <label>City Population</label>
                    <single-selector v-model="searchFilters.populationRange" :options="populationRanges" @onChange="isDirty('populationRange')" :label="'text'" placeholder="Select"></single-selector>
                </div>

                <div class="form-group" v-if="policyAreas">
                    <label>Policy Areas</label>
                    <filter-selector 
                        v-model="searchFilters.policyAreas" 
                        :options="policyAreas" 
                        @onChange="isDirty('policyAreas')" 
                        :label="null" placeholder="Search">
                    </filter-selector>
                </div>
                              
            </div>

            <div class="input-group search-input-wrapper pl-2 pr-2 pb-3 pt-3" v-if="showSearch">
                <input type="text" class="form-control search-input" v-model="searchFilters.searchText"  placeholder="Search" v-on:keyup.13="isDirty('searchText')" aria-label="Recipient's username" aria-describedby="basic-addon2">
                <div class="input-group-append">
                    <button class="btn btn-search" @click="isDirty('searchText')" type="button" id="button-addon2"><i class="fas fa-search"></i></button>
                </div>
            </div>

        </div>
    </div>
</template>



<script>
import Api from '@/api';
import moment from 'moment';
import FilterSelector from '@/components/partials/selectors/FilterSelector';
//import FilterButton from '@/components/partials/buttons/FilterButton';
import SingleSelector from '@/components/partials/selectors/SingleSelector';
import { bus } from '@/utils/EventBus';
//import FilterIcon from '@/components/partials/svg/FilterIcon';

export default {
    name: 'mobile-search-bar',
    components: {
        //FilterButton,
        FilterSelector,
        SingleSelector
    },
    props: ['instanceId'],
    data() {
        return {
            showSearch: false,
            selectedFilter: null,
            showFilter: false,
            tab: 'table',
            filters: {
                states: { field: 'states', label: 'Location' },
                fromDate: { field: 'fromDate', label: 'From Date' },
                toDate: { field: 'toDate', label: 'To Date' },
                //populationRange: { field: 'populationRanges', label: 'City Population', isSingle: true },
                actionTypes: { field: 'actionTypes', label: 'Action Types' },
                populations: { field: 'populations', label: 'Cohort Affected' },
                policyAreas: { field: 'policyAreas', label: 'Policy Area' }
            },
            populationRanges: [
                { text: '<30K', min: 0, max: 29999 },
                { text: '30K to 100K', min: 30000, max: 99999 },
                { text: '100K to 500K', min: 100000, max: 499999 },
                { text: '500K to 1M', min: 500000, max: 999999 },
                { text: '1M+', min: 1000000, max: 99999999999 }
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
    async mounted() {
        this.getMeta();
        this.isDirty();
    },
    methods: {
        getFilterOptions(field) {
            switch (field) {
                case 'actionTypes':
                    return this.actionTypes;
                case 'policyAreas':
                    return this.policyAreas;
                case 'cities':
                    return this.cities;
                case 'states':
                    return this.states;
                case 'populations':
                    return this.populations;
                case 'entities':
                    return this.entities;
                case 'categories':
                    return this.categories;
            }
            return null;
        },

        dateFormatter(date) {
            return moment(date).format('MM/DD/YYYY');
        },

        onAddAction(){
            window.location = "https://airtable.com/shreFb5JKWpfEugjG";
        },

        isDirty(field) {

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
            this.$nextTick(() => {
                bus.$emit(`actiontracker_${this.instanceId}.search-change`, this.searchFilters);
            });
        },

        onResetFilters(){
            this.searchFilters = {};
            this.selectedFilter = null;
            this.showSearch = false;
            
            this.$nextTick(()=>{
                bus.$emit(`actiontracker_${this.instanceId}.reset`, this.searchFilters);
            })            

        },

        async getMeta() {
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
#MobileSearchPage {

    // Override WP
    li::before {
        content: none !important;
    }

    .form-group {
        
        margin: 0px;
        margin-bottom: 5px;

        label {
            color: black;
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0;
            margin: 0px;
            margin-left: 0px;
        }
    }

    .date-picker {
        .form-control {
            color: black !important;
        }
    }

    .main-filter-bar {
        background-color: lighten(#26bbe3, 10%);
    }

    .main-search-bar {
        color: white;
        background-color: #26bbe3;
    }
}
</style>

