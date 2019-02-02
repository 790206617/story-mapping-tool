<template>
    <el-container>
        <el-aside class="side-description" width="25px">Project Backlog</el-aside>
        <el-main class="map">

        </el-main>
    </el-container>
</template>

<script>
import vBar from './CardBar.vue';
export default {
     data() {
            return {
             hello:this.gogo
            }
     },
    components:{
        vBar
    },
    props: ['gogo'],
}
</script>

<style>
    .map-container{
        padding-top: 10px;
        height: 650px;
    }
    .map{
        float:left;
        background-color:white;
        height: 100%;
        width:97.5%;
    }
    .side-description{
        float:left;
        width: 2.5%;
        height: 97%;
        background-color:lightslategray;
        writing-mode:vertical-rl;
        padding-top: 20px;
        text-align: left;
        font-size: 22px;
    }
</style>
