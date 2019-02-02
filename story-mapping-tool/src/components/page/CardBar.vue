<template>
    <div class="cbar-container">
        {{title}}
    </div>
</template>

<script>
    export default {
     data() {
            return {
             title:this.go
            }
     },
    props: ['go'],
    }
    
</script>

<style>
    .cbar-container{
        margin-top: 10px;
        height: 30px;
        background-color:red;
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