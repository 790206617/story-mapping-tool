<template>
        <VueDragResize v-show="show" :isActive="isClick" :w="width" :h="height" v-on:resizing="resize" v-on:dragging="resize" :parentLimitation="true" :snapToGrid="true" :gridX="20" :gridY="20"  
        :parentW="1340" :parentH="500"  :minw="100" :minh="100" :x="left" :y="top"  @clicked="focus()">
            <p class="changeline">{{ title }}</p>
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
                width: 140,
                height: 70,
                top: 220,
                left: 20,
                title:'',
                isClick:false,
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
                 this.isClick=true; 
                 this.$emit("listen-click",this.title,this.id.id);
                 console.log("emit title:"+this.title);
            },
       
        },
        props: ['id'],
        mounted(){
             bus.$on('sendTitle',(data,id)=>{
             if(id==this.id.id){
                axios.put("/aop/card/"+id,{
                    id:id,
                    cardName:null,
                    cardContent:data,
                    color:this.id.color,
                    status:this.id.status,
                }).then(result=>{
                    if(result.data==true){
                        this.$message('保存成功');
                        this.title=data;
                    }else{
                        this.$message('保存失败');
                    }
                })
             }});
            bus.$on('deleteCard',(id)=>{
             if(id==this.id.id){
                 axios.delete("/aop/card/"+id)
                 .then(result=>{
                    console.log("delete_card:"+id+" succeed");
                    this.show=false;
                 })
             }
             });
            bus.$on('isClick',(id,status)=>{
                 if(id==this.id.id){
                     this.isClick=status;
                    }
            });
        },
        created(){
            this.top=this.id.x;
            this.left=this.id.y;
            this.title=this.id.cardContent;
        }
    }
</script>

<style>
    .changeline{
        width: 100%;
        height: auto;
        font-size:10px;
        text-align:center;
        vertical-align:middle;
        font-weight:bold;
        font-family: "PingFang SC";
    }
</style>
