<template>

    <div class="dropdown at-single-selector" v-if="filteredOptions && divId">

        <b-dropdown :id="divId" :text="placeholder" class="w-100" variant="light">

            <template v-slot:button-content>
                <span v-if="!selected || !selected[label]">{{placeholder}}</span>
                <span v-else>{{selected[label]}}</span>
            </template>

            <b-dropdown-item v-for="(opt, index) in filteredOptions" :key="index" @click="onSelect(opt)">
                <span class='at-text-selector-item' :class="{'selected': selected[label] == opt[label]}">
                    <b-iconstack>
                        <b-icon stacked icon="square"></b-icon>
                        <b-icon v-if="selected[label] == opt[label]" stacked icon="check"></b-icon>
                    </b-iconstack>
                    {{opt[label]}}
                </span>
            </b-dropdown-item>
        </b-dropdown>

    </div>

</template>

<script>

import _ from 'lodash';
import Utils from '@/utils/Utils';

export default {
	name: 'single-selector',

	props: {
		value: [String, Object, Array],
		label: {
			type: String,
			default: 'status'
		},
		placeholder: {
			type: String,
			default: 'Search...'
		},		
		options: {
			type: Array,
			default: null
		}			
	},

    components: {
    },

	data() {
		return {
            divId: null,
            selected: {},
            fuse: null,
            query: null,
            selectedHash: {}
		};
	},

	watch: {
        value(){
            if (this.value){
                this.selected = this.value;
            }
            else {
                this.selected = {};
            }
        },
		options() {
            this.init();
		}
	},

	mounted() {
        this.divId = Utils.guidGenerator();
        this.init();
        if (this.value){
            this.selected = this.value;
        }
        else {
            this.selected = {};
        }
	},

    computed: {
        filteredOptions(){
            if (this.fuse && this.query){
                let matches = this.fuse.search(this.query);
                return _.map(matches, 'item'); // .slice(0, this.maxItems);
            }
            else if (this.options){
                return this.options; // .slice(0, this.maxItems);
            }
            return null;
        }
    },

	methods: {

        init(){

            if (!this.options){
                return;
            }


        },

		onSelect(item) {        
            // Is this item already selected? If so, unselect
            if (item[this.label] == this.selected[this.label]){
                this.selected = {};
            }
            else {
                this.selected = item;
            }

            this.$emit('input', this.selected);
            this.$emit('onChange', this.selected);            
        },
	}
};
</script>

<style lang="scss">

.at-single-selector {

    color: black;

    .dropdown-toggle {
        font-size: 14px !important;
        // text-align: left !important;
    }

    .selected {
        font-weight: bold;
    }

    .btn-dropdown-wrapper {
        height: 40px !important;
    }

    .dropdown-toggle{
      display:flex !important;
      align-items:center;
      font-size: .85rem !important;
      min-height: 34px;

      &:after{
          margin-left:auto !important;
      }  
    }
    
    .at-text-selector-item {
        color: black;        
        font-size: 12px !important;
        text-align: left;
        font-weight: 300;
        letter-spacing: 0;
        line-height: 14px;   
    }
    
    .dropdown-item {
        font-size: 12px !important;
        padding-left: 15px !important;
        padding-right: 15px !important;
    }

    .dropdown-menu {
        max-height: 400px;
        overflow-y: auto;
    }

}



</style>