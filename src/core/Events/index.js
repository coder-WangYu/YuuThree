/**
 * @Editor：WYDX
 * @CreateTime: 2022-05-06 09:38:46
 * @LastEditor: WYDX
 * @LastEditTime: 2022-05-06 09:38:46
 * @Description: 事件类：Three相关事件
 */
import { Raycaster, Vector2 } from "three";
import Yrender from "../Render";
import Ycamera from "../Camera";
import Yscene from "../Scene";
import Yfloor from "../Floor";
import Ygeometry from "../Geometry";

class YEvents {
  // 监听视口拉伸事件
  initWindowResize() {
    window.addEventListener("resize", () => {
      Ycamera.camera.aspect = window.innerWidth / window.innerHeight
      Ycamera.camera.updateProjectionMatrix()
      Yrender.renderer.setSize(window.innerWidth, window.innerHeight)
    })
  }

  // 射线法选中几何体
  initThreeClickEvent(wrapper) {
    // 创建射线
    const raycaster = new Raycaster()
    // 创建矢量坐标
    const pointer = new Vector2()
    // 开启鼠标按下事件监听
    wrapper.addEventListener("click", onWrapperMousedown, false)
    // 事件逻辑
    function onWrapperMousedown(e) {
      e.preventDefault()
      pointer.x = (e.clientX / Yrender.renderer.domElement.clientWidth) * 2 - 1;
      pointer.y = -(e.clientY / Yrender.renderer.domElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, Ycamera.camera)
      const intersects = raycaster.intersectObjects(Yscene.scene.children);
      const nearMesh = intersects[0] // 距离最近的几何体
      if (nearMesh) {
        Ygeometry.initControllerSystem(nearMesh)
      }
    }
  }

  // 监听视角控件
  initViewMouseDownEvent(top, right, bottom, left) {
    const v_top = document.getElementById(top)
    const v_right = document.getElementById(right)
    const v_bottom = document.getElementById(bottom)
    const v_left = document.getElementById(left)

    v_top.addEventListener('mousedown', event => {
      Yscene.scene.children.forEach(child => {
        child.rotation.x += 1 * Math.PI / 180
      })
      Yrender.renderer.render(Yscene.scene, Ycamera.camera)
    });

    v_right.addEventListener('mousedown', event => {
      Yscene.scene.children.forEach(child => {
        child.rotation.y += 1 * Math.PI / 180
      })
      Yrender.renderer.render(Yscene.scene, Ycamera.camera)
    });

    v_bottom.addEventListener('mousedown', event => {
      Yscene.scene.children.forEach(child => {
        child.rotation.x -= 1 * Math.PI / 180
      })
      Yrender.renderer.render(Yscene.scene, Ycamera.camera)
    });

    v_left.addEventListener('mousedown', event => {
      Yscene.scene.children.forEach(child => {
        child.rotation.y -= 1 * Math.PI / 180
      })
      Yrender.renderer.render(Yscene.scene, Ycamera.camera)
    });
  }

  // 监听画布拖拽
  initCanvasDragEvent() {
    const c_mb = document.getElementById("MB")
    c_mb.onmousedown = e => {
      const initX = e.clientX, initY = e.clientY
      c_mb.onmousemove = e => {
        const currentX = e.clientX,
          currentY = e.clientY,
          dertX = currentX - initX,
          dertY = currentY - initY
        Yfloor.floor.position.x += dertX / 100
        Yfloor.floor.position.y -= dertY / 100
        Yrender.renderer.render(Yscene.scene, Ycamera.camera)
      }
      c_mb.onmouseup = e => {
        c_mb.onmousemove = null
      }
    }
  }

  // 解绑画布拖拽
  dispatchCanvasDragEvent() {
    const c_mb = document.getElementById("MB")
    c_mb.onmousedown = null
    c_mb.onmouseup = null
  }
}

export default new YEvents()
