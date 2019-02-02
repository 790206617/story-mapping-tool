<template>
    <VueDragResize v-show="show" class="background" :w="width" :h="height"   v-on:dragging="resize" :parentW="1340" :parentH="1500" :isResizable="false" :parentLimitation="true" :aspectRatio="true" :x="left" :y="top" axis="y" @clicked="focus()"  >
    </VueDragResize>
</template>

<script>
    import VueDragResize from 'vue-drag-resize';
    import bus from '../common/bus';
    import axios from "axios";
    export default {
        components: {
            VueDragResize
        },
           data() {
            return {
                width: 1600,
                height: 15,
                top: 390,
                left:10,
                show:true,
            }
        },
        methods: {
            resize(newRect) {
                this.width = newRect.width;
                this.height = newRect.height;
                this.top = newRect.top;
                this.left = newRect.left;
                this.id.x=this.top;
                this.id.y=this.left;
            },
             focus(){
                 this.$emit("listen-it",this.id.id);
            },
        },
        props: ['id','index'],
        mounted(){ 
            bus.$on('deleteIt',(id)=>{
             if(id==this.id.id){
                  axios.delete("/aop/slice/"+id)
                 .then(result=>{
                    console.log("delete_slice:"+id+" succeed");
                    this.show=false;
                 })
             }
             })
        },
        created(){
            this.top=this.id.x;
            this.left=this.id.y;
        }
    }
</script>
<style>
    .background{
        font-size:10px;
        background-color:#FFD700;
    }
</style>