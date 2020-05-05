<template>
    <div id="TopMetricsCard">
                
        <div v-if="numberPolicies" class="row justify-content-center">

            <div class="col-md-auto at-stat">                
                <div class="text-stat text-policies">{{numberPolicies | number}}</div>
                <div class="text-tagline">Policies tracked to date</div>
            </div>

            <div class="col-md-auto col-left-border at-stat">
                <div class="text-stat text-cities">{{numberCities | number}}</div>
                <div class="text-tagline">Cities and growing</div>
            </div>

            <div class="col-md-auto col-left-border at-stat">
                <div class="text-stat text-people">{{totalPeopleImpacted | number}}</div>
                <div class="text-tagline">Citizens impacted by policies tracked</div>
            </div>
        </div>


    </div>
</template>


<script>

import Api from '@/api';

export default {
    name: 'top-metrics-card',
    data() {
        return {
            numberPolicies: null,
            totalPeopleImpacted: null,
            numberCities: null
        }
    },         
    async mounted(){
        this.getMeta();
    },    
    methods: {
        async getMeta(){
            // Get data meta info
            let dataMeta = await Api().get('meta'); 
            this.totalPeopleImpacted = dataMeta.data.totalPeopleImpacted;
            this.numberCities = dataMeta.data.numberCities;
            this.numberPolicies = dataMeta.data.numberPolicies;
        }        
    }
};
</script>

<style lang="scss">

#TopMetricsCard {
    
    .at-stat{
        font-weight: bold;
    }

    @media (max-width: 767px) {
        padding-left: 55px; 
        padding-right: 55px;

        .col-left-border {
            border-top: 1px solid #C4C4C4;
        }

        .at-stat {
            padding-top: 20px;
            padding-bottom: 20px;
            padding-left: 0px !important;
            padding-right: 0px !important;
        }

    }

    @media (min-width: 768px) {

        .col-left-border {
            border-left: 1px solid #C4C4C4;
            padding-left: 20px !important;
        }

        //padding-left: 300px;
        //padding-right: 300px;
    }


    .text-stat {
        font-size: 40px;
        font-weight: bold;
        line-height: 48px;
        margin-bottom: 0px;
        
    }

    .text-tagline {
        color: #26323E;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: bold;
        letter-spacing: 0;
        line-height: 14px;        
    }

    .text-policies {
        color: #0055B8;
    }

    .text-cities {
        color: #4FDBC5;
    }

    .text-people {
        color: #26BBE3;
    }

}
</style>

