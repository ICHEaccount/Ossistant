import SurfaceUserImage from '../../../images/node_icon/surfaceuser.png';
import PostImage from '../../../images/node_icon/post.png';
import DomainImage from '../../../images/node_icon/domain.png';
import axios from 'axios';


const options = {
  layout:{
    hierarchical: {
      enabled:true,
      sortMethod: 'directed',
      nodeSpacing : 150
    }
  },
  manipulation: {
    addEdge : function(edgeData, callback) {
      if (edgeData){
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
          })
        }
      }
    },
    addNode : false,
    deleteNode : false,
    editEdge : function(edgeData , callback) {
      if(edgeData){
        if(edgeData.from !== edgeData.to){
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
        })
      }
    },
  },
  // groups: {
    // SurfaceUser: {
    //   shape: 'image',
    //   image: {
    //     selected: SurfaceUserImage,
    //     unselected: SurfaceUserImage, 
    //     background: 'transparent', 
    //   },
    //   label: {
    //     field: 'username',
    //     drawThreshold: 1,
    //   },
    //   font: {
    //     size: 12, 
    //   },
    // },
    // Post: {
    //   shape: 'image',
    //   image: {
    //     selected: PostImage,
    //     unselected: PostImage, 
    //     background: 'transparent', 
    //   },
    //   label: {
    //     field: 'username',
    //     drawThreshold: 1,
    //   },
    //   font: {
    //     size: 12, // Adjust font size as needed
    //   },
    // },
    // Domain: {
    //   shape: 'image',
    //   image: {
    //     selected: DomainImage,
    //     unselected: DomainImage, 
    //     background: 'transparent', 
    //   },
    //   label: {
    //     field: 'domain',
    //     drawThreshold: 1,
    //   },
    //   font: {
    //     size: 12, // Adjust font size as needed
    //   },
    // },    
  // },
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
    smooth: {
      type: 'dynamic',
    },
    arrows: {
      to: { enabled: true, scaleFactor: 1, type: "arrow" }
    }
  },
};

export default options;
