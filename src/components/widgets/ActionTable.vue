<template>
    <div id="ActionTable">
            
        <!-- DATA TABLE (MOBILE) ------>

        <mq-layout :mq="['sm', 'md']">

            <!-- TABLE PAGING ------>

            <div class="row mt-4 mb-0 pb-0" v-if="searchMeta">
                <div class="col">
                    <span class="text-info">Page {{page}} of {{searchMeta.numberPages}}</span>
                    <span class="text-muted ml-1 small">{{searchMeta.totalResults}} total</span>
                </div>
                <div class="col" align="right">
                    <button type="button" class="btn btn-link" v-on:click="prevPage()" v-bind:class="{'disabled text-muted':page == 1}">
                        <b-icon icon="chevron-left"></b-icon>
                    </button>
                    <button type="button" class="btn btn-link" v-on:click="nextPage()" v-bind:class="{'disabled text-muted':page >= (searchMeta.numberPages)}">
                        <b-icon icon="chevron-right"></b-icon>
                    </button>
                </div>
            </div>


            <div class="action-list pr-2">

                <span 
                    v-for="action in dataList" 
                    :key="action.uuid" >
                    <action-card 
                        class="mb-2"      
                        :canDownload="false"
                        :action="action">
                    </action-card>         
                </span>

            </div>

        </mq-layout>

        <!-- DATA TABLE (DESKTOP) ------>

        <mq-layout :mq="['lg', 'xl']">
            Page: {{page}}
            <vue-good-table
                class="mt-4"
                v-if="dataList"
                mode="remote"
                :line-numbers="false"
                @on-page-change="onPageChange"
                @on-sort-change="onSortChange"
                @on-column-filter="onColumnFilter"
                @on-per-page-change="onPerPageChange" 
                @on-selected-rows-change="onCheckBoxSelections"
                :isLoading.sync="isLoading"
                :totalRows="searchMeta.totalResults"
                :columns="columns"
                :rows="dataList"
                styleClass="vgt-table"
                row-style-class="vgt-row"
                :selectOptions="{
                    enabled: true,
                    selectOnCheckboxOnly: true, // only select when checkbox is clicked instead of the row
                    //selectionInfoClass: 'custom-class',
                    //selectionText: 'rows selected',
                    clearSelectionText: 'clear',
                    //disableSelectInfo: true, // disable the select info panel on top
                }"            
                :pagination-options="{
                    dropdownAllowAll: true,
                    position: 'top',
                    enabled: true,
                    perPage: this.perPage
                }"
            >
                <template slot="emptystate">
                    <div class='text-info' align="left">
                        <p class="mt-1 mb-1">
                            No results found with this combination of filters. Please clear filters and search again.
                        </p>
                    </div>
                </template>

                <template slot="table-row" slot-scope="props">

                    <span v-if="props.column.type == 'date2'">
                        <span class="text-primary">{{props.row[props.column.field] | date('MMM DD, YYYY')}}</span> 
                    </span>


                    <span v-else-if="props.column.type == 'check'">
                        <div>
                            <input type="checkbox" class="" id="exampleCheck1">
                        </div>
                    </span>

                    <span v-else-if="props.column.type == 'action-date'">
                        <!-- ACTION DATE -->
                        <div class="text-lead">{{props.row.dateOfAction| date('MM/DD/YYYY')}}</div> 
                        <!-- ACTION TYPES -->
                        <div>
                            <span v-for="(action, index) in props.row.actionTypes" :key="index">
                                <div v-if="action" class="badge badge-light badge-tracker capitalize">{{action}}</div>
                            </span>                            
                        </div>                        
                    </span>

                    <span v-else-if="props.column.type == 'location'">
                        <!-- LOCATION -->
                        <div class="text-lead" v-if="props.row.city">{{props.row.city}}, {{props.row.stateCode}} <span class="text-sub">({{props.row.population | number}})</span></div> 
                        <!-- POPULATION -->
                        <div>
                            <span v-for="(pop, index) in props.row.populationImpacted" :key="index">
                                <div v-if="pop" class="badge badge-light badge-tracker capitalize">{{pop}}</div>
                            </span>                            
                        </div>                           
                    </span>

                    <span v-else-if="props.column.type == 'policy-area'">
                        <!-- POLICY AREA -->
                        <div>
                            <span v-for="(policy, index) in props.row.policyAreas" :key="index">
                                <div v-if="policy" class="badge badge-light badge-tracker capitalize">{{policy}}</div>
                            </span>                            
                        </div>                        
                    </span>

                    <span v-else-if="props.column.type == 'description'">
                        <!-- DESCRIPTION -->
                        <div>
                            <div v-if="props.row.description" class="text-description">{{props.row.description.length > 250 ? props.row.description.substring(0,250)+"..." : props.row.description  }}</div> 
                            <div v-if="props.row.reference && isLink(props.row.reference)">
                                <a :href="props.row.reference" target="_blank" class="text-link">Link to Text or Release</a>
                            </div>
                            <div v-else class="text-sub">{{props.row.reference}}</div>
                        </div>
                    </span>

                    <span v-else-if="props.column.type == 'contact'">
                        <!-- CONTACT -->
                        <div v-if="props.row.pocFullName && props.row.pocFullName!=''" class="text-lead">{{props.row.pocFullName}}</div> 
                        <div v-if="props.row.pocEmail && props.row.pocEmail!=''" class="text-sub">{{props.row.pocEmail}}</div> 
                        <div v-if="props.row.pocPhone && props.row.pocPhone!=''" class="text-sub">{{props.row.pocPhone | phone}}</div> 
                    </span>
                
                    <span v-else>
                        <span :data="props.row[props.column.field]">{{props.row[props.column.field]}}</span>
                    </span>

                </template>

            </vue-good-table>
        </mq-layout>

    </div>
</template>



<script>

import Api from '@/api';
import {bus} from '@/utils/EventBus';
import moment from 'moment';
import _ from 'lodash';
import 'vue-good-table/dist/vue-good-table.css';
import { VueGoodTable } from 'vue-good-table';
import Utils from '@/utils/Utils';
import ActionCard from '@/components/partials/cards/ActionCard';

export default {
    name: 'action-table',
    components: {
        VueGoodTable,
        ActionCard
    },
    props: ['instanceId'],
    data() {
        return {

            columns: [
                {label: 'Action Date', type: 'action-date', subTitle: 'Action Type', field: 'dateOfAction', sortable: true, width:'160px'},
                {label: 'City, State', type: 'location', sub: '(Population)', subTitle: 'Cohort Affected', field: 'city', sortable: true, width:'200px'},
                {label: 'Policy Area ', type: 'policy-area', subTitle: null, field: 'policyAreas', sortable: false, width:'180px'},
                {label: 'Policy Description', type: 'description', subTitle: null, field: 'description', sortable: false},
                {label: 'Contact', type: 'contact', subTitle: null, field: 'pocFullName', sortable: false, width:'160px'},
            ],

            isLoading: false,
            sortByDirection: -1,
            sortByCol: 'dateOfAction',
            page: 1,
            perPage: 10,
            searchFilters: {},

            dataList: null,
            searchMeta: null
        }
    },     
    mounted(){        
        if (this.$mq == 'sm' || this.$mq === 'md'){
            this.perPage = 5;
        }
        bus.$on(`actiontracker_${this.instanceId}.search-change`, this.onSearchChange);
        bus.$on(`actiontracker_${this.instanceId}.reset`, this.onReset);
        this.getData();
    },
    methods: {

        isLink(str){
            return (str.search('http') !== -1);
        },

        // This is the same as a search change, but we should reset table sorting 
        // and all search options
        onReset(){
            this.searchFilters = {};
            this.sortByDirection = -1;
            this.sortByCol = 'dateOfAction';
            this.page = 0;
            this.perPage = 0;
            this.getData();
        },

        onSearchChange(searchFilters){
            this.searchFilters = searchFilters;
            this.getData();
        },

        onCheckBoxSelections(info){
            //this.$log('CHECKED: ', info.selectedRows);
            this.$set(this.searchFilters, 'checkedActions', info.selectedRows);
            //this.searchFilters.checkedActions = selectedRows;
        },

        async getData(){
            
            if (this.searchFilters && this.searchFilters.defaultSort){
                this.sortByDirection = -1;
                this.sortByCol = this.searchFilters.defaultSort;
                this.searchFilters.defaultSort = null;
            }

            let opts = {
                limit: this.perPage,
                skip: (this.page - 1) * this.perPage,
                sortKey: this.sortByCol,
                sortDirection:	this.sortByDirection
            }

            let res = await Api().post(`data/search?`, Utils.getSearchQueryParams(opts, this.searchFilters));
            this.searchMeta = res.data.meta;
            this.dataList = res.data.results;

        },

        // Mobile paging....

        prevPage() {
            if (this.page > 1) {
                this.page -= 1;
            }
            this.getData();
        },

        nextPage() {
            if (this.page < this.searchMeta.numberPages) {
                this.page += 1;
            }
            this.getData();
        },
        
        // Table contols...

        onPageChange(params) {
            this.page = params.currentPage;
            this.getData();
        },

        onPerPageChange(params) {
            this.perPage = params.currentPerPage;
            this.getData();
        },

        onSortChange(params) {

            //this.$log('onSortChange', params)

            this.sortByCol = params[0].field;

            if (params[0].type == 'asc'){
                this.sortByDirection = 1;
            }
            else {
                this.sortByDirection = -1;
            }

            this.getData();

        },

        onColumnFilter(params) {
            this.$log('onColumnFilter', params)
            //this.updateParams(params);
            //this.loadItems();
        }
        
    }
};
</script>

<style lang="scss">
$brand_primary: #007bff; 

$sort-chevron-width: 5px;
$chevron-color: $brand_primary; //#b5becf;
$text-color: #606266 !default;
$border-color: #dcdfe6 !default;
$link-color: #3087dd;

$table-font-size: 12px;

%bold{
    //font-family: Gotham-Bold;
    color: #000;
}

#ActionTable {

    .badge {
        font-weight: normal !important;
        margin-right: 2px;
        font-size: 11px !important;
        line-height:1.1 !important;
        margin:1px 2px 2px 0;
        @media (max-width:1099px) and (min-width:768px){
            white-space: normal !important;
            text-align:left !important;
        }
        &-light{
           background-color:#fff !important; 
        }
    }

    .badge-tracker {
        border: 1px solid #DFDEDE;
        border-radius: 4px;
    }

    .text-link {
        color: #000000;
        @extend %bold;
        text-decoration: underline;
    }

    .text-lead {
        //font-weight: bold;
        @extend %bold;
    }

    .text-sub {
        font-weight: 100;
        word-break:break-word;
    }

    .vgt-wrap__footer {
        padding-left: 0px;
        @media (min-width:768px){
            padding-left:10px;
        }
        padding-right: 0px;
        padding-bottom: 15px;
        padding-top:0;
        margin-bottom: 5px;
        border: none !important;
        /* border-bottom: 1px dotted rgba(120,120,120,0.2); */
        background: none !important;
        background-color: transparent !important;
    }

    .vgt-wrap {
        border: none;
    }

    .vgt-table {

        /*
        .sortable {
            &:after {
                border-bottom-color: red;
            }
            &:before {
                border-top-color: red;
            }
        }
        */


        color: inherit;
        font-size: 12px !important;
        border: none !important;

        td {
            border: none !important;
        }

        tr {
            border: none !important;
            border-bottom: 1px solid rgb(222, 226, 230) !important;
        }

        tbody {
            th,
            td {
                &:nth-child(3){
                    @media(min-width:768px){
                        border-right:1px solid $border-color !important;
                    }

                }
                font-weight: 500 !important;
                padding-top: 15px;
                padding-bottom: 15px;
                vertical-align: top !important;
                white-space: normal !important;
            }
        }
        
        thead {
            border-bottom: 2px solid rgb(222, 226, 230) !important;
        }

        thead {
            th {
                //color: map-get($theme-colors, success);
                font-size: 12px;
            }
        }    

        th {
            border: none !important;
            background: none !important;
            background-color: transparent !important;
        }
    }



}
</style>

