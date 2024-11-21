<template>
  <div>
    <!-- <button @click="changeColor">Change color</button>
    <button @click="showMesh">show mesh</button>-->
    <div style="background:#fff;font-family: 'Lato', sans-serif;">
      <div style="width:100vw;height:100vh" id="abc"></div>
    </div>
  </div>
</template>
<script>
import go from "gojs";
import "../map/extentions/Shape";
const $ = go.GraphObject.make;

export default {
  methods: {},
  mounted() {
    //var strokeBinding = new go.Binding("stroke", "fill");
    let diagram = $(go.Diagram, "abc");

    console.log(new go.Spot(0.5, 1, 0, -20));
    console.log(go.Spot.parse("0.5 1 0 -20"));
    diagram.undoManager.isEnabled = true;
    // diagram.add(
    //   $(
    //     go.Node,
    //     "Spot",
    //     { width: 100, height: 100 },
    //     $(go.Shape, "MultiDocument", {
    //       stretch: go.GraphObject.Fill,
    //       width: 100,
    //       height: 100,
    //       fill:'yellow'
    //     }),
    //     $(go.Shape, "Circle", {
    //       width:10,
    //       height:10,
    //       fill:'red',
    //       portId: "B",
    //       alignment: go.Spot.parse("0.5 1 0 -20")
    //     })
    //   )
    // );

    diagram.add(
      $(
        go.Node,
        "Auto",
        {
          resizable: true,
          selectable: true,
          rotatable: true,
          locationObjectName: "SHAPE",
          resizeObjectName: "SHAPE",
          selectionObjectName: "SHAPE"
        },
        $(go.Shape, "MultiDocument", {
          name: "SHAPE",
          fill: "yellow",
          //isPanelMain: false,
          stretch: go.GraphObject.Default,
          width: 50,
          height: 50,
          isPanelMain:false
        }),

        $(
          go.TextBlock,
          "Circleasdfasdfasdfkasdjflkasj\r\ndflkasdjflkajsdklfjaskdlfjkalsdjfklasjdfkljaskdlfjklasdjflkasjkdf",
          {
            editable:true, 
            isPanelMain:true,
            desiredSize:new go.Size(NaN,NaN),
            verticalAlignment:go.Spot.Center,
            //minSize:new go.Size(50,NaN),
            //desiredSize:new go.Size(100,100),
            //maxSize:new go.Size(50,NaN),
            //isPanelMain: true,
            textAlign:"center",
            overflow:go.TextBlock.None,
            stretch: go.GraphObject.Fill
          }
        )
      )
    );

    //diagram.model.addNodeData({});
    // diagram.nodeTemplate = $(
    //   go.Node,
    //   "Spot",
    //   { selectionObjectName: "BODY" },
    //   new go.Binding("itemArray", "spots"),
    //   {
    //     // each spot is represented by a Panel holding a circular Shape
    //     // at a particular alignment relative to the "BODY"
    //     itemTemplate: $(
    //       go.Panel,
    //       $(go.Shape, "Circle", {
    //         fill: "red",
    //         portId: " ",
    //         toLinkable: true,
    //         fromLinkable: true,
    //         strokeWidth: 0,
    //         width: 8,
    //         height: 8
    //       }),
    //       new go.Binding("alignment", "spot", go.Spot.parse).makeTwoWay(
    //         go.Spot.stringify
    //       )
    //     ),
    //     // when the user clicks on the node, add a "spot"
    //     click: function(e, obj) {
    //       e.diagram.startTransaction();
    //       // convert click point into Spot in node's bounds
    //       var pt = e.documentPoint; // in document coordinates
    //       var node = obj.part;
    //       var b = node.actualBounds; // will be in document coordinates
    //       var spot = new go.Spot(
    //         Math.max(0, Math.min((pt.x - b.x) / b.width, 1)),
    //         Math.max(0, Math.min((pt.y - b.y) / b.height, 1))
    //       );
    //       // add an Object describing the spot's location (as a Spot value)
    //       var spotsArray = node.data.spots ;
    //       if (!Array.isArray(spotsArray)) spotsArray = node.data.spots = [];
    //       e.diagram.model.addArrayItem(spotsArray, {
    //         spot: go.Spot.stringify(spot)
    //       });
    //       e.diagram.commitTransaction("added spot");
    //     }
    //   },
    //   $(
    //     go.Panel,
    //     "Auto",
    //     { name: "BODY", width: 100, height: 100 },
    //     $(go.Shape, { fill: "whitesmoke" }),
    //     $(go.TextBlock, { editable: true }, new go.Binding("text").makeTwoWay())
    //   )
    // );

    // diagram.linkTemplate = $(
    //   go.Link, // the whole link panel
    //   {
    //     routing: go.Link.AvoidsNodes,
    //     curve: go.Link.JumpOver,
    //     corner: 5,
    //     toShortLength: 4,
    //     relinkableFrom: true,
    //     relinkableTo: true,
    //     reshapable: true,
    //     resegmentable: true,
    //     // mouse-overs subtly highlight links:
    //     mouseEnter: function(e, link) {
    //       link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
    //     },
    //     mouseLeave: function(e, link) {
    //       link.findObject("HIGHLIGHT").stroke = "transparent";
    //     },
    //     selectionAdorned: false
    //   },
    //   new go.Binding("points").makeTwoWay(),
    //   $(
    //     go.Shape, // the highlight shape, normally transparent
    //     {
    //       isPanelMain: true,
    //       strokeWidth: 8,
    //       stroke: "transparent",
    //       name: "HIGHLIGHT"
    //     }
    //   ),
    //   $(
    //     go.Shape, // the link path shape
    //     { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
    //     new go.Binding("stroke", "isSelected", function(sel) {
    //       return sel ? "dodgerblue" : "gray";
    //     }).ofObject()
    //   ),
    //   $(
    //     go.Shape, // the arrowhead
    //     { toArrow: "standard", strokeWidth: 0, fill: "gray" }
    //   ),
    //   $(
    //     go.Panel,
    //     "Auto", // the link label, normally not visible
    //     {
    //       visible: false,
    //       name: "LABEL",
    //       segmentIndex: 2,
    //       segmentFraction: 0.5
    //     },
    //     new go.Binding("visible", "visible").makeTwoWay(),
    //     $(
    //       go.Shape,
    //       "RoundedRectangle", // the label shape
    //       { fill: "#F8F8F8", strokeWidth: 0 }
    //     ),
    //     $(
    //       go.TextBlock,
    //       "Yes", // the label
    //       {
    //         textAlign: "center",
    //         font: "10pt helvetica, arial, sans-serif",
    //         stroke: "#333333",
    //         editable: true
    //       },
    //       new go.Binding("text").makeTwoWay()
    //     )
    //   )
    // );
    // diagram.model = go.Model.fromJson({
    //   class: "go.GraphLinksModel",
    //   copiesArrays: true, // make sure the data.spots Array is copied
    //   copiesArrayObjects: true, // make sure the Objects in those Arrays are also copied
    //   linkFromPortIdProperty: "fromPort",
    //   linkToPortIdProperty: "toPort",
    //   nodeDataArray: [
    //     {
    //       category: "Comment",
    //       loc: "360 -10",
    //       text: "Kookie Brittle",
    //       key: -13
    //     },
    //     { key: -1, category: "Start", loc: "175 0", text: "Start" },
    //     { key: 0, loc: "-5 75", text: "Preheat oven to 375 F" },
    //     {
    //       key: 1,
    //       loc: "175 100",
    //       text:
    //         "In a bowl, blend: 1 cup margarine, 1.5 teaspoon vanilla, 1 teaspoon salt"
    //     },
    //     {
    //       key: 2,
    //       loc: "175 200",
    //       text: "Gradually beat in 1 cup sugar and 2 cups sifted flour"
    //     },
    //     {
    //       key: 3,
    //       loc: "175 290",
    //       text: "Mix in 6 oz (1 cup) Nestle's Semi-Sweet Chocolate Morsels"
    //     },
    //     {
    //       key: 4,
    //       loc: "175 380",
    //       text: "Press evenly into ungreased 15x10x1 pan"
    //     },
    //     {
    //       key: 5,
    //       loc: "355 85",
    //       text: "Finely chop 1/2 cup of your choice of nuts"
    //     },
    //     { key: 6, loc: "175 450", text: "Sprinkle nuts on top" },
    //     { key: 7, loc: "175 515", text: "Bake for 25 minutes and let cool" },
    //     { key: 8, loc: "175 585", text: "Cut into rectangular grid" },
    //     { key: -2, category: "End", loc: "175 660", text: "Enjoy!" }
    //   ],
    //   linkDataArray: [
    //     { from: 1, to: 2 },
    //     { from: 2, to: 3 },
    //     { from: 3, to: 4 },
    //     { from: 4, to: 6 },
    //     { from: 6, to: 7 },
    //     { from: 7, to: 8 },
    //     { from: 8, to: -2 },
    //     { from: -1, to: 0 },
    //     { from: -1, to: 1 },
    //     { from: -1, to: 5 },
    //     { from: 5, to: 4 },
    //     { from: 0, to: 4 }
    //   ]
    // });

    // diagram.add(
    //   $(go.Part, go.Panel.Viewbox, {
    //     resizable: true, position: new go.Point(200, 0), background: "lightgray",
    //     width: 80, height: 80      },
    //     $(go.Panel, 'Auto',
    //       $(go.Shape, "Ellipse", { fill: "lightgreen" }),
    //       $(go.Panel, "Vertical",
    //         $(go.Picture, { source: "images/120x160.png" }),
    //         $(go.TextBlock, "a 120x160 kitten")
    //       ))
    //   ));

    // diagram.add(
    //   $(go.Part, "Auto",
    //     { position: new go.Point(0, 0), background: "lightgray" },
    //     $(go.Shape, "Rectangle", { fill: "lightgreen" }),
    //     $(go.Shape, "LineH", { fill: "lightgreen" }),
    //     $(go.TextBlock, "some text", { margin: 0, background: "yellow" })
    //   ));

    // diagram.add(
    //   $(go.Part, 'Auto',
    //     $(go.Shape, "RoundedRectangle",
    //       {
    //         fill: 'yellow',
    //       },
    //     ),
    //     $(go.Shape, "LineH",
    //       {            position: new go.Point(0, 0),
    //         // name: 'LINE',
    //         stroke: 'black',
    //         fill: 'red',
    //         // strokeWidth: 2,
    //         // portId: "",
    //         // fromSpot: go.Spot.LeftRightSides,
    //         // toSpot: go.Spot.LeftRightSides
    //       })),
    //   $(go.TextBlock, "some text", { margin: 0, background: "yellow" })
    // )

    // diagram.add(
    //   $(go.Part, "Auto",
    //     { minSize: new go.Size(100, 200) },  // set the size of the whole panel
    //     { position: new go.Point(0, 0), background: "lightgray" },
    //     $(go.Shape, "Rectangle", { fill: "lightgreen" }),
    //     $(go.Shape, "Rectangle", { fill: "red" }),
    //     $(go.TextBlock, "Some Wrapping Text", { editable: true, background: "yellow" })
    //   ));

    //this.diagram.nodeTemplateMap = new go.Map();
    // this.diagram.nodeTemplateMap.add(
    //   "grid",
    //   $(
    //     go.Panel,
    //     "Grid",
    //     {
    //       name: "GRID",
    //       visible: false,
    //       gridCellSize: new go.Size(10, 10),
    //       gridOrigin: new go.Point(0, 0)
    //     },
    //     new go.Binding("visible", "mesh", mesh => mesh.visible).ofModel(),
    //     $(go.Shape, "LineH", { strokeWidth: 0.5, interval: 1 }, strokeBinding),
    //     $(go.Shape, "LineH", { strokeWidth: 0.5, interval: 10 }, strokeBinding),
    //     $(go.Shape, "LineV", { strokeWidth: 0.5, interval: 1 }, strokeBinding),
    //     $(go.Shape, "LineV", { strokeWidth: 0.5, interval: 10 }, strokeBinding)
    //   )
    // );

    // this.diagram.grid = this.diagram.nodeTemplateMap.get("grid");

    // this.diagram.nodeTemplate = $(
    //   go.Node,
    //   "Auto",
    //   $(
    //     go.Shape,
    //     "RoundedRectangle",
    //     { fill: "white" }, // the default value if there is no modelData.color property
    //     new go.Binding("fill", "shape", button => button.fill).ofModel()
    //   ), // meaning a property of Model.modelData
    //   $(go.TextBlock, { margin: 5 }, new go.Binding("text"))
    // );

    // this.diagram.model.commit(m => {
    //   m.addNodeData({
    //     text: "sdfdsf"
    //   });
    // });
    //this.diagram = diagram;
    // diagram.add(
    //   $(go.Node,
    //     $(go.TextBlock,
    //       {
    //         text: "this one allows embedded newlines",
    //         background: "lightblue",
    //         editable: true            })
    //   ));
  }
};
</script>

