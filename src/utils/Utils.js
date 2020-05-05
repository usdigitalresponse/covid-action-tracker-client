'use strict';
import moment from 'moment';
import _ from 'lodash';
import Api from '@/api';

export default {

    guidGenerator() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },

    getRootUrl(){

        let rootUrl = process.env.VUE_APP_ROOT_URL ? process.env.VUE_APP_ROOT_URL : 'https://api.actiontracker.org';

        if (window.location.host.search('localhost') != -1) {
            rootUrl = process.env.VUE_APP_ROOT_URL ? process.env.VUE_APP_ROOT_URL : 'http://localhost:5069';
        }

        return rootUrl;
    },

    getSearchQueryParams(opts, searchFilters) {

        let defaults = {
            limit: 20,
            skip: 0,
            sortKey: 'dateOfAction',
            sortDirection: -1
        }

        if (!searchFilters){
            searchFilters = {};
        }

        // Marge defaults with incoming options
        let params = _.merge({}, defaults, opts);

        console.log('defaults = ', defaults);
        console.log('opts = ', opts);
        console.log('params = ', params);
        
        // If the uuid's are set, just use this and ignore other filters
        if (searchFilters.uuids){
            params.uuids = searchFilters.uuids;
        }
        else {

            if (searchFilters.searchText && searchFilters.searchText != ''){
                params.query = searchFilters.searchText;
            }            
                        
            //console.log(`From Date: ${searchFilters.fromDate }, To Date: ${searchFilters.toDate}`);
    
            if (searchFilters.fromDate && searchFilters.fromDate != ''){
                params.fromDate = moment(searchFilters.fromDate).format('MM/DD/YYYY');
            }
            if (searchFilters.toDate && searchFilters.toDate != ''){
                params.toDate = moment(searchFilters.toDate).format('MM/DD/YYYY');
            }
    
            // Process search filters and add to search params...
    
            if (!_.isEmpty(searchFilters.cities)){
                params.cities = searchFilters.cities.join(',');
            }
            if (!_.isEmpty(searchFilters.states)){
                params.states = searchFilters.states.join(',');
            }
            if (!_.isEmpty(searchFilters.policyAreas)){
                params.policyAreas = searchFilters.policyAreas.join(',');
            }
            if (!_.isEmpty(searchFilters.actionTypes)){
                params.actionTypes = searchFilters.actionTypes.join(',');
            }
            if (!_.isEmpty(searchFilters.entities)){
                params.entities = searchFilters.entities.join(',');
            }
            if (!_.isEmpty(searchFilters.populations)){
                params.populations = searchFilters.populations.join(',');
            }
    
            if (searchFilters.populationRange){
                params.populationRange = JSON.stringify(searchFilters.populationRange);
            }


        }

        /*

        var queryString = Object.keys(params).map(function(key) {
            if (typeof params[key] == 'object'){
                return key + '=' + JSON.stringify(params[key])
            }
            else {
                return key + '=' + params[key]
            }
        }).join('&');
        */

        console.log('Searching with options; ', params);

        return params;

    },


}
