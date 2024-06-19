export default class Event {

    constructor(){
      this.defineEvent = {};
      this.usePage = []
    }
  
    on(event, cb, key) {
      this.register(event, cb, key);
    }
  
    off(event,callback) {
      if(this.defineEvent[event]) {
        if(callback) {
          const index = this.defineEvent[event].indexOf(callback);
          this.defineEvent[event].splice(index,1);
        } else {
          this.defineEvent[event].length = 0;
        }
      }
      console.log(this.defineEvent);
    }

    dispatch(event, arg) {
        console.log(this.defineEvent,'dispatchEvent',this.usePage);
      if (this.defineEvent[event]) {
        {
          for (let i = 0, len = this.defineEvent[event].length; i < len; ++i) {
            console.log('dispatchEvent',event)
            this.defineEvent[event][i](arg);
          }
        }
      }
    }
    register(event, cb, key) { 
        !this.defineEvent[event] ? (this.defineEvent[event] = [cb]) : this.defineEvent[event].push(cb);
        // if(!this.defineEvent[event]) {
        //     this.defineEvent[event] = [cb]
        // } else if(this.usePage.indexOf(key) == -1) {
        //     this.defineEvent[event].push(cb);
        // }
        // if(this.usePage.indexOf(key) == -1) {
        //     this.usePage.push(key);        
        // }    
        // // if(!this.defineEvent[event] ) {
        // this.defineEvent[event] = [cb]
        // // }        
    }
    removeEvent() {
      //销毁自定义事件
      for (let i in this.defineEvent) {
        delete this.defineEvent[i];
      }
    }
  
  }