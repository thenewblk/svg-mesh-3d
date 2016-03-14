/*
  This is a more advanced ES6 example, animating and
  rendering the triangles with ThreeJS.

  To test:
    npm install
    npm run start
 */

import THREE from 'three'
import createLoop from 'canvas-loop'
import loadSvg from 'load-svg'
import Tweenr from 'tweenr'
import { parse as getSvgPaths } from 'extract-svg-path'
import randomVec3 from 'gl-vec3/random'
import triangleCentroid from 'triangle-centroid'
import reindex from 'mesh-reindex'
import unindex from 'unindex-mesh'
import shuffle from 'array-shuffle'
import svgMesh3d from '../'
import util from 'util'

const createGeom = require('three-simplicial-complex')(THREE)
const fs = require('fs')

// // // var THREEx = THREEx || {}
// // //
// // // THREEx.VideoTexture	= function(url){
// // // 	// create the video element
// // // 	var video	= document.createElement('video');
// // // 	video.width	= 320;
// // // 	video.height	= 240;
// // // 	video.autoplay	= true;
// // // 	video.loop	= true;
// // // 	video.src	= url;
// // // 	// expose video as this.video
// // // 	this.video	= video
// // //
// // // 	// create the texture
// // // 	var texture	= new THREE.Texture( video );
// // // 	// expose texture as this.texture
// // // 	this.texture	= texture
// // //
// // // 	/**
// // // 	 * update the object
// // // 	 */
// // // 	this.update	= function(){
// // // 		if( video.readyState !== video.HAVE_ENOUGH_DATA )	return;
// // // 		texture.needsUpdate	= true;
// // // 	}
// // //
// // // 	/**
// // // 	 * destroy the object
// // // 	 */
// // // 	this.destroy	= function(){
// // // 		video.pause()
// // // 	}
// // // }
// //
// //
// const tweenr = Tweenr({ defaultEase: 'expoOut' })
// const vertShader = fs.readFileSync(__dirname + '/vert.glsl', 'utf8')
// const fragShader = fs.readFileSync(__dirname + '/frag.glsl', 'utf8')
// let files = fs.readdirSync(__dirname + '/svg')
//   .filter(file => /\.svg$/.test(file))
// files = shuffle(files)
//
// document.querySelector('.count').innerText = files.length
//
// const canvas = document.querySelector('canvas')
// canvas.addEventListener('touchstart', (ev) => ev.preventDefault())
// canvas.addEventListener('contextmenu', (ev) => ev.preventDefault())
//
// const renderer = new THREE.WebGLRenderer({
//   canvas: canvas,
//   antialias: true,
//   devicePixelRatio: window.devicePixelRatio
// })
// renderer.setClearColor(0x97c2c5, 1)
//
// const scene = new THREE.Scene()
// const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100)
// camera.position.set(0, 0, 5)
//
// let pointer = 0
// createApp()
// nextSvgMesh()
//
// var video, texture, material, mesh;
//
// function nextSvgMesh (delay) {
//   delay = delay || 0
//   var file = files[0]
//   // loadSvg('demo/svg/' + file, (err, svg) => {
//   //   if (err) throw err
//     renderSVG(null, delay)
//   // })
// }
//
// function renderSVG (svg, delay) {
//   delay = delay || 0
//
//   const wireframe = pointer % 2 === 0
//   var path = "M1187.1,139.1L905.6,286.5L878.5,87.1l94.6-83.5H783.7c-28.7,0-53.6,20.9-57.6,50.1L702,229.2l97.9,112.6L412.9,139.1 c-20.7-10.8-42-1.1-47.4,21.5L220.3,768.4l64.3,12.9c22.9,4.6,45.4-10.3,50-33.2l19.1-93.6l59.3,12c22.9,4.6,44.8-10.4,48.7-33.4 l0,0l16.1-94.2L533,550c0,0,0,0,0,0c22.8,4.6,44.1-10.6,47.3-33.6l13-94.9l80.2,16.1l-46.9,342.3l114.8,23.1l58.6,93.5l58.3-93.2 l114.8-22.5l-46.8-343.2l80.4-16.2l13,94.9c3.1,23.1,24.5,38.2,47.3,33.6l0,0l55.2-11.1l16,94.2c3.9,23,25.8,38,48.7,33.4l59.3-12 l19.1,93.6c4.7,22.9,27.2,37.8,50,33.2l64.4-12.9l-145.1-607.8C1229.1,137.9,1207.8,128.2,1187.1,139.1z";
//
//   var mesh = svgMesh3d(path, { delaunay: true, scale: 1, simplify: 0.01})
//   // var bird = new createGeom(mesh)
//   // grab all <path> data
//   // const svgPath = getSvgPaths(svg)
//   // triangulate
//   // let complex = svgMesh3d(svgPath, {
//   //   delaunay: false,
//   //   scale: 10,
//   //   simplify: 0.01
//   //   // play with this value for different aesthetic
//   //   // randomization: 500,
//   // })
//
//   // console.log("complex: " + complex);
//   // split mesh into separate triangles so no vertices are shared
//   mesh = reindex(unindex(mesh.positions, mesh.cells))
//
//   // we will animate the triangles in the vertex shader
//   const attributes = getAnimationAttributes(mesh.positions, mesh.cells)
//
//   // build a ThreeJS geometry from the mesh primitive
//   var geometry = new createGeom(mesh)
//   assignUVs( geometry );
//   // var updateFcts	= [];
//   // var videoTexture= new THREEx.VideoTexture('the-nitty-gritty.mp4')
//   // updateFcts.push(function(delta, now){
//   //     // to update the texture are every frame
//   //     videoTexture.update(delta, now)
//   // });
//
//   // our shader material
//   const material = new THREE.ShaderMaterial({
//     color: 0xffffff,
//     side: THREE.DoubleSide,
//     vertexShader: vertShader,
//     fragmentShader: fragShader,
//     wireframe: wireframe,
//     transparent: true,
//     wireframe: false,
//     attributes: attributes,
//     uniforms: {
//       opacity: { type: 'f', value: 1 },
//       scale: { type: 'f', value: 0 },
//       texture: { type: 't', value: videoTexture },
//       animate: { type: 'f', value: 0 }
//     }
//   })
//
//   var video = document.getElementById( 'video' );
//   // texture = new THREE.VideoTexture( video );
//   //
//   // texture.needsUpdate = true;
//   // texture.minFilter = THREE.LinearFilter;
// 	// texture.magFilter = THREE.LinearFilter;
// 	// texture.format = THREE.RGBFormat;
//
//   // var videoTexture = new THREE.Texture( video );
//   // videoTexture.minFilter = THREE.LinearFilter;
//   // videoTexture.magFilter = THREE.LinearFilter;
//   // videoTexture.needsUpdate = true;
//   //
//
//   var video = document.getElementById( 'video' );
//   var videoImage = document.createElement( 'canvas' );
//   videoImage.width = 600;
//   videoImage.height = 430;
//
//   //sorry, not 100% sure why this is necessary -eg why the renderer doesn't automatically update the video texture in render()
//   var videoImageContext = videoImage.getContext( '2d' );
//   // background color if no video present
//   videoImageContext.fillStyle = '#000000';
//   videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );
//
//   var videoTexture = new THREE.Texture( video );
//   videoTexture.minFilter = THREE.LinearFilter;
//   videoTexture.magFilter = THREE.LinearFilter;
//   videoTexture.needsUpdate = true;
//
//
//
//   // material = new THREE.MeshLambertMaterial({
//   //   color: 0xffffff,
//   //   map: texture
//   // });
//
//   mesh = new THREE.Mesh(geometry, material);
//   // mesh.uniform.map = videoTexture;
//   scene.add(mesh);
//
//   // renderer.autoClear = false;
//   const interval = 2 + delay
//
//   // explode in
//   tweenr.to(material.uniforms.animate, {
//     value: 1, duration: 1.5, delay: delay, ease: 'expoInOut'
//   })
//   tweenr.to(material.uniforms.scale, {
//     value: 1, duration: 1, delay: delay
//   })
//
//   // explode out
//   // tweenr.to(material.uniforms.scale, {
//   //   delay: interval, value: 0, duration: 0.75, ease: 'expoIn'
//   // })
//   // tweenr.to(material.uniforms.animate, {
//   //   duration: 0.75, value: 0, delay: interval
//   // }).on('complete', () => {
//   //   geometry.dispose()
//   //   geometry.vertices.length = 0
//   //   scene.remove(mesh)
//   //   nextSvgMesh()
//   // })
// }
//
// function getAnimationAttributes (positions, cells) {
//   const directions = []
//   const centroids = []
//   for (let i=0; i<cells.length; i++) {
//     const [ f0, f1, f2 ] = cells[i]
//     const triangle = [ positions[f0], positions[f1], positions[f2] ]
//     const center = triangleCentroid(triangle)
//     const dir = new THREE.Vector3().fromArray(center)
//     centroids.push(dir, dir, dir)
//
//     const random = randomVec3([], Math.random())
//     const anim = new THREE.Vector3().fromArray(random)
//     directions.push(anim, anim, anim)
//   }
//   return {
//     direction: { type: 'v3', value: directions },
//     centroid: { type: 'v3', value: centroids }
//   }
// }
//
// function createApp () {
//   const app = createLoop(canvas, { scale: renderer.devicePixelRatio })
//     .start()
//     .on('tick', render)
//     .on('resize', resize)
//
//   function resize () {
//     var [ width, height ] = app.shape
//     camera.aspect = width / height
//     renderer.setSize(width, height, false)
//     camera.updateProjectionMatrix()
//     render()
//   }
//
//   function render () {
//     renderer.render(scene, camera);
//     // renderer.autoClear = false;
//   }
//
//   // function animate() {
//   //
// 	// 	requestAnimationFrame( animate );
//   //
// 	// 	render();
//   //
// 	// }
//
//   resize()
// }


function assignUVs ( geometry ){

    geometry.computeBoundingBox();

    var max     = geometry.boundingBox.max;
    var min     = geometry.boundingBox.min;

    var offset  = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range   = new THREE.Vector2(max.x - min.x, max.y - min.y);

    geometry.faceVertexUvs[0] = [];
    var faces = geometry.faces;

    for (var i = 0; i < geometry.faces.length ; i++) {

      var v1 = geometry.vertices[faces[i].a];
      var v2 = geometry.vertices[faces[i].b];
      var v3 = geometry.vertices[faces[i].c];

      geometry.faceVertexUvs[0].push([
        new THREE.Vector2( ( v1.x + offset.x ) / range.x , ( v1.y + offset.y ) / range.y ),
        new THREE.Vector2( ( v2.x + offset.x ) / range.x , ( v2.y + offset.y ) / range.y ),
        new THREE.Vector2( ( v3.x + offset.x ) / range.x , ( v3.y + offset.y ) / range.y )
      ]);

    }

    geometry.uvsNeedUpdate = true;

}


// setting up the renderer
var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setClearColor(0x000000, 0)
renderer.setSize(750, 750);


var container = document.createElement('div');
document.body.appendChild( container );
container.appendChild( renderer.domElement );
// creating a new scene
    // SCENE
var scene = new THREE.Scene();
// CAMERA
var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
var VIEW_ANGLE = 100, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;

const camera = new THREE.PerspectiveCamera(30, 1, 1, 10)
camera.position.set(0, 0, 5)
camera.lookAt(scene.position);

scene.add(camera);

var video = document.getElementById( 'video' );
var videoImage = document.createElement( 'canvas' );
videoImage.width = 600;
videoImage.height = 430;

//sorry, not 100% sure why this is necessary -eg why the renderer doesn't automatically update the video texture in render()
var videoImageContext = videoImage.getContext( '2d' );
// background color if no video present
// videoImageContext.fillStyle = '#000000';
videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

var videoTexture = new THREE.Texture( video );
videoTexture.generateMipmaps = false;
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.needsUpdate = true;


  var movieMaterial = new THREE.MeshBasicMaterial( {  color: 0xffffff, side: THREE.DoubleSide } );

  var path = "M1187.1,139.1L905.6,286.5L878.5,87.1l94.6-83.5H783.7c-28.7,0-53.6,20.9-57.6,50.1L702,229.2l97.9,112.6L412.9,139.1 c-20.7-10.8-42-1.1-47.4,21.5L220.3,768.4l64.3,12.9c22.9,4.6,45.4-10.3,50-33.2l19.1-93.6l59.3,12c22.9,4.6,44.8-10.4,48.7-33.4 l0,0l16.1-94.2L533,550c0,0,0,0,0,0c22.8,4.6,44.1-10.6,47.3-33.6l13-94.9l80.2,16.1l-46.9,342.3l114.8,23.1l58.6,93.5l58.3-93.2 l114.8-22.5l-46.8-343.2l80.4-16.2l13,94.9c3.1,23.1,24.5,38.2,47.3,33.6l0,0l55.2-11.1l16,94.2c3.9,23,25.8,38,48.7,33.4l59.3-12 l19.1,93.6c4.7,22.9,27.2,37.8,50,33.2l64.4-12.9l-145.1-607.8C1229.1,137.9,1207.8,128.2,1187.1,139.1z";

  var mesh = svgMesh3d(path, { delaunay: true, scale: 1, });

  var bird = new createGeom(mesh);

  assignUVs( bird );

  // console.log("bird: " + util.inspect(bird));
  var movieScreen = new THREE.Mesh( bird, movieMaterial );
  movieScreen.material.map = videoTexture;
  scene.add(movieScreen);

// var light = new THREE.DirectionalLight( 0xff00ff, 10 );
// light.position.set(1,1,1 );
// scene.add( light );
//
// var light2 = new THREE.DirectionalLight( 0xffffff, 15 );
// light2.position.set(1,1,-10 );
// scene.add( light2 );


render();



function render(){

    requestAnimationFrame(render);
    if ( video.readyState === video.HAVE_ENOUGH_DATA )
    {
        videoImageContext.drawImage( video, 0, 0 );
        if ( videoTexture )
            videoTexture.needsUpdate = true;
            movieScreen.material.map = videoTexture;
    }
    // calling again render function
    renderer.render(scene, camera);

}
