<template>
    <span>
        <button class="btn btn-light btn-tracker" @click="onDownload()">
            <download-icon />Download
        </button>

        <a ref="downloadBtn" :href="downloadLink" class="d-none" />

        <b-modal id="downloadModal" v-model="modalShow" title="Download Actions" @ok="onDoDownload()">
            <p>Note that this will download data based on the current search filters and settings.</p>
        </b-modal>

    </span>
</template>



<script>
import Api from '@/api';
import DownloadIcon from '@/components/partials/svg/DownloadIcon';
import { bus } from '@/utils/EventBus';
import Utils from '@/utils/Utils';
import _ from 'lodash';
import axios from 'axios';

export default {
    name: 'download-actions-button',
    props: {
        opts: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    components: {
        DownloadIcon
    },
    data() {
        return {
            modalShow: false,
            modalDivId: null,
            rootUrl: null,
            downloadLink: null
        };
    },
    async mounted() {
        this.modalDivId = Utils.guidGenerator();
        this.rootUrl = Utils.getRootUrl();
        this.setDownloadLink();
    },
    methods: {

        setDownloadLink() {

            let opts = {};
            
            if (this.opts.filters && this.opts.filters.checkedActions){
                opts.uuids = _.map(this.opts.filters.checkedActions, 'uuid').join(',');
            }

            if (!opts.uuids || opts.uuids.length == 0) {
                opts = this.opts;
            }

            let queryString = Utils.getSearchQueryParams(opts);
            this.downloadLink = `${this.rootUrl}/data/download?${queryString}`;
        },

        onDownload(){

            //this.setDownloadLink();

            let opts = {};
            
            if (this.opts.filters && this.opts.filters.checkedActions){
                opts.uuids = _.map(this.opts.filters.checkedActions, 'uuid').join(',');
            }

            if (!opts.uuids || opts.uuids.length == 0) {
                opts = this.opts;
            }

            //this.$nextTick(()=>{
            //    var elem = this.$refs.downloadBtn;     
            //    elem.click();
            //});

            //let res = await Api().post(`data/search?`, Utils.getSearchQueryParams(opts, this.searchFilters));

            axios({
                url: `${this.rootUrl}/data/download`,
                method: 'POST',
                data: Utils.getSearchQueryParams(opts),
                responseType: 'blob'
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'download.csv');
                document.body.appendChild(link);
                link.click();
            });

            /*
            jQuery.ajax({
                type: "GET",
                url: this.downloadLink,
                xhrFields: {
                    responseType: 'blob'
                },
                success(blob) {
                    var windowUrl = window.URL || window.webkitURL;
                    var url = windowUrl.createObjectURL(blob);
                    var anchor = document.createElement('a');
                    anchor.href = url;
                    anchor.download = 'download.csv';
                    anchor.click();
                    anchor.parentNode.removeChild(anchor);
                    windowUrl.revokeObjectURL(url);
                },
                error(err) {
                    console.log(err);
                }
            });  
            */
        /*
            var reader = new FileReader();
            reader.onload = function(e) {
                var bdata = btoa(reader.result);
                var datauri = 'data:' + isbContentType + ';base64,' + bdata;
                window.open(datauri);
                newWindow = setTimeout(function() {
                    newWindow.document.title = isbFilename;
                }, 10);
            };

            reader.readAsBinaryString(iobBLOB);


            */

            //this.modalShow = true;
        },

        //onDoDownload() {
        //    var elem = this.$refs.downloadBtn        
        //    elem.click();
        //}
    }
};
</script>
