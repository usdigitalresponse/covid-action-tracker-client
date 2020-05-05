<template>


	<div class="dropdown at-filter-selector" v-if="options && divId">
		
        <b-dropdown :id="divId" :text="placeholder" class="w-100" variant="light" :right="right">

            <template v-slot:button-content>
                <span v-if="!selected || selected.length == 0">{{placeholder}}</span>
                <span v-else>{{selected.length}} selected</span>
            </template>

            <b-dropdown-item v-for="(opt, index) in options" :key="index" @click="onSelect(opt)">
				<span class='at-text-selector-item' :class="{'selected': selectedHash[opt]}">

                    <b-iconstack>
                        <b-icon stacked icon="square"></b-icon>
                        <b-icon v-if="selectedHash[opt]" stacked icon="check"></b-icon>
                    </b-iconstack>
                    {{opt}}
                </span>
            </b-dropdown-item>
        </b-dropdown>

	</div>

</template>

<script>

import _ from 'lodash';
import Utils from '@/utils/Utils';

export default {
	name: 'filter-selector',

	props: {
		value: [String, Object, Array],
		placeholder: {
			type: String,
			default: 'Search...'
		},		
		options: {
			type: Array,
			default: null
        },
        right: {
            Boolean,
            default: false
        }		
	},

    components: {
    },

	data() {
		return {
            divId: null,
            selected: null,
            query: null,
            selectedHash: {},
            updating: false
		};
	},

	watch: {
        value(){
            this.processValue();
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
            this.selected = [];
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

        processValue(){

            if (!this.selected){
                this.selected = [];
            }

            if (!this.updating){
                
                this.selected = this.value;

                    // reset
                if (this.selectedHash){
                    let keys = Object.keys(this.selectedHash);
                    if (keys){
                        for (let i=0; i<keys.length; i+=1){
                            this.$set(this.selectedHash, keys[i], false);
                        }
                    }
                }

                if (this.selected){
                    for (let i=0; i<this.selected.length; i+=1){
                        this.$set(this.selectedHash, this.selected[i], true);
                    }
                }
            }
        },

		onSelect(opt) {

            this.updating = true;

            if (!this.selected){
                this.selected = [];
            }

            if (typeof this.selectedHash[opt] == 'undefined'){
                this.$set(this.selectedHash, opt, true);
                this.selected.push(opt);
            }
            else {
                if (this.selectedHash[opt] === true){
                    this.$set(this.selectedHash, opt, false);
                    let list = [];
                    for (let i=0; i<this.selected.length; i+=1){
                        if (this.selected[i] != opt){
                            list.push(this.selected[i]);
                        }
                    }
                    this.selected = list;
                }
                else {
                    this.$set(this.selectedHash, opt, true);
                    this.selected.push(opt);
                }
            }
            
            this.$emit('input', this.selected);
            this.$emit('onChange', this.selected);

            this.$nextTick(()=>{
                this.updating = false;
            });
            
        },
	}
};
</script>

<style lang="scss">

.at-filter-selector {

    color: black;

    .filter-active {
        .btn {
            //border-color: red !important;
            border-color: #E1F7FD;
        }
    }

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