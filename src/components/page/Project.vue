<template>
  <div >
    <el-row>
      <el-card class="mgb20" style="height:150px;float:top">
        <el-row :gutter="20">
          <el-col :span="18">
            <div class="grid-content bg-purple" style="font-size:24px;font-family:'PingFang SC';">画布名称：{{ pname }}</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <!-- <el-button type="primary"  size="mini" @click="move" :disabled="ismove">
              <i class="el-icon-upload2">移动</i>
              </el-button> -->
              <!-- <el-button type="primary" size="mini" @click="move" :disabled="!ismove">
              <i class="el-icon-download">固定</i>
              </el-button> -->
              <el-button type="primary" size="mini" @click="saveCanvas">保存画布</el-button>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12" >
              <div class="grid-content bg-purple">
                <el-input style="margin-top:20px;width:550px"
                  class="text-area"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="text"
                  :disabled="hasCard"
                ></el-input>
              </div>
          </el-col>

          <el-col :span="12" class="button">
                <el-dropdown trigger="click" @command="handleCommand">
                  <el-button type="primary" size="mini">添加便签</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item class="font-red" command="lightsalmon">红色</el-dropdown-item>
                    <el-dropdown-item class="font-green" command="yellowgreen">绿色</el-dropdown-item>
                    <el-dropdown-item class="font-blue" command="cadetblue">蓝色</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button
                  type="success"
                  size="mini"
                  @click="save(text,nowfocus_id)"
                  :disabled="hasCard"
                >保存文本</el-button>
            <el-button
              type="info"
              size="mini"
              @click="clear(nowfocus_id)"
              :disabled="hasCard"
            >清空文本</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="deleteCard(nowfocus_id)"
              :disabled="hasCard"
            >删除卡片</el-button>
         
            <el-button type="primary" size="mini" @click="addIteration">添加迭代</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="deleteIteration(foucus_it)"
              :disabled="hasIt"
            >删除迭代</el-button>
            </el-col>
        </el-row>
      </el-card>
    </el-row>

    <!-- <v-map class="project-map"></v-map> -->
    <div style="height:800px;background-color:white;float:top;">
      <v-drag   
        v-for="(card,index) in cardArr"
        v-bind:id="card"
        :x="card.x"
        :y="card.y"
        :index="index"
        :key="`card${index}`"
        :style="getStyle(card.color)"
        @listen-click="getClick"
      ></v-drag>
      <v-sliceh
        v-for="(slice,index) in slicehArr"
        :id="slice"
        :index="index"
        :key="`it${index}`"
        @listen-it="getIt"
      ></v-sliceh>
    </div>
  </div>
</template>

<script>
import vDrag from "./Drag.vue";
import vMap from "./Map.vue";
import vBar from "./CardBar.vue";
import bus from "../common/bus";
import vSliceh from "./SliceH.vue";
import axios from "axios";
export default {
  data() {
    return {
      count: 0,
      slicehCount: 0,
      pname: localStorage.getItem("canvasname"),
      pid: localStorage.getItem("canvasid"),
      cardArr: [],
      slicehArr: [],
      text: "",
      disable: true,
      nowfocus_id: null,
      foucus_it: null,
      hasCard: true,
      hasIt: true,
      ismove:true,
    };
  },
  components: {
    vDrag,
    vMap,
    vBar,
    vSliceh
  },
  methods: {
    handleCommand(command) {
      var color=null;
      switch(command){
        case "lightsalmon": color=4;break;
        case "yellowgreen": color=5;break;
        case "cadetblue" : color=6;break;
      }
      axios.post("/aop/card/",{
        canvasId:this.pid,
        x:220,
        y:20,
        color:color,
      }).then(result=>{
        console.log("new_card:"+result.data);
      var card = result.data;
      this.cardArr.push(card);
      this.hasCard = false;
      })
    },
    addIteration() {
      // this.slicehCount = this.slicehCount + 1;
      // this.slicehArr.push(this.slicehCount);
      // this.hasIt = false;
      axios.post("/aop/slice/",{
        canvasId:this.pid,
        x:390,
        y:10,
        type:0,
      }).then(result=>{
        console.log("new_sliceh:"+result.data);
        // this.slicehCount = this.slicehCount + 1;
        this.slicehArr.push(result.data);
        this.hasIt = false;
      })
    },
    getStyle(color) {
       switch(color){
        case 4: return "background-color:lightsalmon" ;break;
        case 5: return "background-color:yellowgreen";break;
        case 6: return "background-color:cadetblue";break;
      }
    },
    save(data, index) {
      bus.$emit("sendTitle", data, index);
    },
    clear(index) {
      this.text = "";
      bus.$emit("sendTitle", this.text, index);
    },
    getClick: function(data, id) {
      if (this.nowfocus_id == null) {
        this.nowfocus_id = id;
        console.log("first id");
      } else if (this.nowfocus_id != id) {
        bus.$emit("isClick", this.nowfocus_id, false);
        console.log("before focus:" + this.nowfocus_id);
        this.nowfocus_id = id;
        bus.$emit("isClick", this.nowfocus_id, true);
        console.log("change id");
      } else {
        console.log("nothing to change");
        // bus.$emit('focus',this.nowfocus_id);
      }
      this.text = data;
      // this.disable=!data;
      // console.log("father focus:"+this.disable+":"+this.nowfocus_id);
    },
    getIt(id) {
      this.foucus_it = id;
      console.log("it:" + id);
    },
    deleteCard(id) {
      bus.$emit("deleteCard", id);
      this.text = "";
      // console.log("被删除："+id);
    },
    deleteIteration(Iterationid) {
      bus.$emit("deleteIt", Iterationid);
    },
    getCanvas() {
      console.log("pid:" + this.pid);
      axios.get("/aop/canvas/" + this.pid).then(result => {
        var canvas=result.data;
        this.cardArr=canvas.cards;
        this.slicehArr=canvas.slices;
        if(this.cardArr.length>0){
          this.hasCard=false;
        }
        if(this.slicehArr.length>0){
          this.hasIt=false;
        }
        console.log(result.data);
      });
    },
    saveCanvas(){
      // this.$router.push('/');
      var cards=[];
      var slices=[];
      for(var i=0; i<this.cardArr.length; i++){
        var card=this.cardArr[i];
        var cardPosition={
            id:card.id,
            x:card.x,
            y:card.y,
          };
           cards.push(cardPosition);
      }
        for(var i=0; i<this.slicehArr.length; i++){
          var sliceh=this.slicehArr[i];
            var slicePosition={
            id:sliceh.id,
            x:sliceh.x,
            y:sliceh.y,
          };
          slices.push(slicePosition);
        }
        console.log(slices);
      var canvas={
        id:parseInt(this.pid),
        cards:cards,
        characters:[],
        slices:slices,
      };
      axios.put("/aop/canvas/position/"+this.pid,canvas).then(
         result=>{
           if(result.data==true){
             this.$message('保存成功');
           }else{
             this.$message('保存失败');
           }
        }
      )
    },
    move(){
      this.ismove=!this.ismove;
      this.fixed();
    },
    fixed(){
      //发送card组件的id,
      bus.$emit("fixCard", this.nowfocus_id);
    }
  },
  created() {
    this.getCanvas();
  },
  mounted(){
    console.log("change_card:"+this.cardArr);
    console.log("change_slice:"+this.slicehArr);
    bus.$on("change-site",(card)=>{

    })
  }
};
</script>

<style>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  font-size: 20px;
  color: rgb(255, 255, 255);
}
.title-right {
  float: right;
  width: 150px;
  padding-top: 5px;
  padding-right: 25px;
  cursor: pointer;
}
.title-left {
  float: left;
  padding-top: 10px;
  padding-left: 20px;
}
.add-note {
  float: left;
  text-align: center;
  width: 70px;
  height: 30px;
}
.add-iteration {
  float: right;
  text-align: center;
  width: 70px;
  height: 30px;
}
.font-red {
  background-color: lightsalmon;
  color: white;
}
.font-green {
  background-color: yellowgreen;
  color: white;
}
.font-blue {
  background-color: cadetblue;
  color: white;
}
.resize-drag {
  position: relative;
  width: 150px;
  height: 150px;
  background-color: red;
  z-index: 999;
  margin-top: 20px;
  margin-left: 40px;
}
.project-map {
  position: absolute;
  /* padding-top: 10px; */
  width: 97%;
  height: 800px;
  padding-top: 10px;
}
.project-card {
  position: absolute;
  margin-top: 2%;
  margin-left: 3%;
  width: 100%;
  height: 100%;
}
.bar-container {
  padding-top: 2%;
  margin-top: 10px;
  height: 60px;
  background-color: yellow;
}
.text-area {
  margin-left: 5%;
}
.button {
  margin-top: 30px;
}
.card-button {
  margin-top: 14px;
  margin-left: 52px;
}
</style>
