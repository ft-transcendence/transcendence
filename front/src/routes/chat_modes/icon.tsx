
export function LockIcon()
{
	return (
		
		<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
			viewBox="0 0 330 330" width="50">
			<g id="XMLID_509_">
				<path id="XMLID_510_" d="M65,330h200c8.284,0,15-6.716,15-15V145c0-8.284-6.716-15-15-15h-15V85c0-46.869-38.131-85-85-85
					S80,38.131,80,85v45H65c-8.284,0-15,6.716-15,15v170C50,323.284,56.716,330,65,330z M180,234.986V255c0,8.284-6.716,15-15,15
					s-15-6.716-15-15v-20.014c-6.068-4.565-10-11.824-10-19.986c0-13.785,11.215-25,25-25s25,11.215,25,25
					C190,223.162,186.068,230.421,180,234.986z M110,85c0-30.327,24.673-55,55-55s55,24.673,55,55v45H110V85z"/>
			</g>
		</svg>

	)

}

export function AddUserIcon({onClick}: {onClick?:() => void})
{
	return (
		
		<svg width="35" viewBox="0 0 149 156" fill="none" xmlns="http://www.w3.org/2000/svg" onMouseUp={onClick}>
			<path d="M6.81402 136.829H63.8683C72.6112 148.499 86.1415 156 101.302 156C127.603 156 149 133.425 149 105.677C149 77.9295 127.603 55.3548 101.302 55.3548C85.635 55.3548 71.7085 63.3662 63.0079 75.7091C59.4814 74.9289 55.8786 74.5253 52.2409 74.5253C23.4352 74.5253 0 99.25 0 129.641C0 133.611 3.05087 136.829 6.81402 136.829ZM101.302 69.7327C120.088 69.7327 135.372 85.8575 135.372 105.677C135.372 125.497 120.088 141.622 101.302 141.622C82.5156 141.622 67.2317 125.497 67.2317 105.677C67.2317 85.8575 82.5156 69.7327 101.302 69.7327Z" fill="#E9E9E9"/>
			<path d="M52.2408 0C36.5222 0 23.735 13.4912 23.735 30.0742C23.735 46.6572 36.5222 60.1475 52.2408 60.1475C67.959 60.1475 80.7462 46.6572 80.7462 30.0742C80.7462 13.4912 67.959 0 52.2408 0Z" fill="#E9E9E9"/>
			<path d="M87.6738 112.866H94.4878V120.055C94.4878 124.026 97.5387 127.244 101.302 127.244C105.065 127.244 108.116 124.026 108.116 120.055V112.866H114.93C118.693 112.866 121.744 109.648 121.744 105.677C121.744 101.707 118.693 98.4885 114.93 98.4885H108.116V91.2995C108.116 87.3293 105.065 84.1106 101.302 84.1106C97.5387 84.1106 94.4878 87.3293 94.4878 91.2995V98.4885H87.6738C83.9106 98.4885 80.8597 101.707 80.8597 105.677C80.8597 109.648 83.9106 112.866 87.6738 112.866Z" fill="#E9E9E9"/>
		</svg>


	)
}


export function QuitIcon({onClick}: {onClick?:() => void})
{
	return (
		
		<div className={"xicon"}>
			<div onMouseUp={onClick} style={{transform: "rotateZ(45deg)", color: "rgb(207, 202, 202)", fontSize: 30, lineHeight: "15px"}}>
				+
			</div>
		</div>


	)
}