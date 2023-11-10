import SurfaceUserImage from '../../../images/node_icon/surfaceuser.png';
import PostImage from '../../../images/node_icon/post.png';
import DomainImage from '../../../images/node_icon/domain.png';

const options = {
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
