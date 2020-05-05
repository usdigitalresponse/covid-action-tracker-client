import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash';
import moment from 'moment';
import Api from '@/api';
//import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {    
        dataMeta: null,
        totalPeopleImpacted: 0,
        numberCities: 0,
        numberPolicies: 0,
        actionTypes: null,
        policyAreas: null,
        cities: null,
        states: null,
        populations: null,
        entities: null,
        categories: null,
        dateLatest: null,
        dateOldest: null,
        // Current search results
        geoDataList: null,
        dataList: null,
        dataSummaryList: null,
        searchMeta: {},
        appView: null
    },
    mutations: {


        setTotalPeopleImpacted(state, totalPeopleImpacted){
            state.totalPeopleImpacted = totalPeopleImpacted;
        },
        setNumberCities(state, numberCities){
            state.numberCities = numberCities;
        },
        setNumberPolicies(state, numberPolicies){
            state.numberPolicies = numberPolicies;
        },

        setActionTypes(state, actionTypes) {
            state.actionTypes = actionTypes;
        },
        setPolicyAreas(state, policyAreas) {
            state.policyAreas = policyAreas;
        },
        setCities(state, cities) {
            state.cities = cities;
        },
        setStates(state, states) {
            state.states = states;
        },
        setPopulations(state, populations) {
            state.populations = populations;
        },
        setEntities(state, entities) {
            state.entities = entities;
        },
        setCategories(state, categories) {
            state.categories = categories;
        },      
        setDateLatest(state, dateLatest) {
            state.dateLatest = dateLatest;
        },            
        setDateOldest(state, dateOldest) {
            state.dateOldest = dateOldest;
        },

        setSummaryDataList(state, data){
            state.dataSummaryList = data;
        },
        setDataList(state, dataList) {
            state.dataList = dataList;
        },
        setGeoDataList(state, geoDataList) {
            state.geoDataList = geoDataList;
        },
        setSearchMeta(state, searchMeta) {
            state.searchMeta = searchMeta;
        }   
               
    },
    getters: {

		//isActionAllowed(state) {
        //    return (action)=>{
        //        if (!state.identityState){
        //            return
        //        }
        //        return state.identityState.isActionAllowed(action);
        //    }			
        //}
        
        /**
         * Get any basic data that we'll need 
         */
        async setup({ state, commit, dispatch }) {

            // Get data meta info
            let dataMeta = await Api().get('meta'); 

            if (dataMeta){
                commit('setTotalPeopleImpacted', dataMeta.data.totalPeopleImpacted);
                commit('setNumberCities', dataMeta.data.numberCities);
                commit('setNumberPolicies', dataMeta.data.numberPolicies);

                commit('setDateLatest', dataMeta.data.dateLatest);
                commit('setDateOldest', dataMeta.data.dateOldest);
                commit('setActionTypes', dataMeta.data.actionTypes);
                commit('setPolicyAreas', dataMeta.data.policyAreas);
                commit('setCities', dataMeta.data.cities);
                commit('setStates', dataMeta.data.states);
                commit('setPopulations', dataMeta.data.populations);
                commit('setEntities', dataMeta.data.entities);
                commit('setCategories', dataMeta.data.categories);
            }
        }
    
    }
})
