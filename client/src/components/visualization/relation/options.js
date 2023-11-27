import SurfaceUserImage from '../../../images/node_icon/surfaceuser.png';
import PostImage from '../../../images/node_icon/post.png';
import DomainImage from '../../../images/node_icon/domain.png';
import DarkUserImage from '../../../images/node_icon/darkuser.png';
import CommentImage from '../../../images/node_icon/comment.png';
import EmailImage from '../../../images/node_icon/email.png';
import PhoneImage from '../../../images/node_icon/phone.png';
import MessageImage from '../../../images/node_icon/message.png';
import WalletImage from '../../../images/node_icon/wallet.png';
import PersonImage from '../../../images/node_icon/person.png';
import CompanyImage from '../../../images/node_icon/company.png';

import axios from 'axios';
import store from '../../../reducers/store'
import {changeBehavior} from '../../../reducers/node'


const options = {
  autoResize:false,
  layout:{
    hierarchical: {
      enabled:true,
      nodeSpacing : 200
    }
  },
  manipulation: {
    addEdge : function(edgeData, callback) {
      if (edgeData){
        console.log("edgeData : " + JSON.stringify(edgeData));
        if (edgeData.from !== edgeData.to){
          const reqData = {
            'type': '0',
            'from': edgeData.from,
            'to': edgeData.to
          }
          console.log(edgeData);
          axios.post("/graph/rel/create",reqData).then((response) => {
            const isRel = response.data.isrel;
            if(isRel === false){
              callback(edgeData);
            }
            store.dispatch(changeBehavior('rel-add'))
          })
        }
      }
    },
    addNode : false,
    deleteNode : false,
    editEdge : function(edgeData , callback) {
      console.log(JSON.stringify(edgeData));
      if(edgeData){
        if(edgeData.from !== edgeData.to && !edgeData.from.includes("targetNode") && !edgeData.to.includes("targetNode")){
          const reqData = {
            'type' : '0',
            'from': edgeData.from,
            'to': edgeData.to
          }
          
          console.log('edit' + JSON.stringify(reqData));
          axios.post("/graph/rel/create",reqData).then((response) => {
            if(response.status === 200){
              callback(edgeData);
            }
          })
        }
      }
      store.dispatch(changeBehavior('rel-edit'))
    },
    deleteEdge : function(edgeData, callback){
      if(edgeData){
        const reqData = {
          'uid': edgeData.edges[0]
        }
        axios.post("/graph/rel/delete",reqData).then((response) => {
          if(response.status === 200){
            callback(edgeData);
          }
          store.dispatch(changeBehavior('rel-delete'))
        })
      }
    },
  },
  groups: {
    SurfaceUser: {
      shape: 'image',
      image: {
        selected: SurfaceUserImage,
        unselected: SurfaceUserImage, 
        background: 'transparent', 
      },
    },
    Post: {
      shape: 'image',
      image: {
        selected: PostImage,
        unselected: PostImage, 
        background: 'transparent', 
      },
    },
    Domain: {
      shape: 'image',
      image: {
        selected: DomainImage,
        unselected: DomainImage, 
        background: 'transparent', 
      },
      font: {
        size: 12, // Adjust font size as needed
      },
    },
    DarkUser: {
      shape: 'image',
      image: {
        selected: DarkUserImage,
        unselected: DarkUserImage, 
        background: 'transparent', 
      },
    },
    Comment: {
      shape: 'image',
      image: {
        selected: CommentImage,
        unselected: CommentImage, 
        background: 'transparent', 
      },
    },  
    Email: {
      shape: 'image',
      image: {
        selected: EmailImage,
        unselected: EmailImage, 
        background: 'transparent', 
      },
    },  
    Phone: {
      shape: 'image',
      image: {
        selected: PhoneImage,
        unselected: PhoneImage, 
        background: 'transparent', 
      },
    },  
    Message: {
      shape: 'image',
      image: {
        selected: MessageImage,
        unselected: MessageImage, 
        background: 'transparent', 
      },
    },  
    Wallet: {
      shape: 'image',
      image: {
        selected: WalletImage,
        unselected: WalletImage, 
        background: 'transparent', 
      },
    },  
    Company: {
      shape: 'image',
      image: {
        selected: CompanyImage,
        unselected: CompanyImage, 
        background: 'transparent', 
      },
    }, 
    Person: {
      shape: 'image',
      image: {
        selected: PersonImage,
        unselected: PersonImage, 
        background: 'transparent', 
      },
    },                        
  },
  nodes: {
    shape : 'box'
  },
  edges: {
    color: {
      color: '#848484',
      highlight: '#FF0000',
    },
    font: {
      size: 8,
    },
    scaling: {
      min: 1,
      max: 15,
    },
    smooth: { type: 'continuous' },
    arrows: {
      to: { enabled: true, scaleFactor: 1, type: "arrow" }
    },
    hideEdgesOnZoom : true
  },    
  interaction: {
    hover: true,
  },
  animation: {
    offset: { x: 0, y: 0 },
  }
};

export default options;
