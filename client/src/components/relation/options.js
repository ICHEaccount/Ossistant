const options = {
  groups: {
    SurfaceUser: {
      shape: 'circle',
      color: {
        background: 'skyblue',
       },
      font: {
        size: 12, // Adjust font size as needed
      },
      label: {
        field: 'username',
        drawThreshold: 1,
        },
      },
    Email: {
      shape: 'circle',
      color: {
        background: 'yellow',
      },
      font: {
        size: 12, // Adjust font size as needed
      },
      label: {
        field: 'username',
        drawThreshold: 1,
      },
    },
    Domain : {
      shape : 'star',
      color: {
        background: 'green',
      },
      font: {
        size: 8, // Adjust font size as needed
      },
      label: {
        field: 'domain',
        drawThreshold: 1,
      },
    }
  },
  edges: {
    arrows: {
      to: { enabled: true, scaleFactor: 1, type: 'arrow' },
    },
    color: {
      color: '#848484',
      highlight: '#FF0000',
    },
    font: {
      size: 12,
    },
    scaling: {
      min: 1,
      max: 15,
    },
  },
};

export default options;
