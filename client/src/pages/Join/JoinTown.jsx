import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Button from '../../components/Common/Button/Button';
import TopNavigation from '../../components/Common/TopNavigation/TopNavigation';
import * as authApi from '../../api/auth';
import { useUserDispatch, useUserState } from '../../contexts/User/UserContext';
import { setLogin } from '../../contexts/User/UserTypes';
import { onLoginSuccess } from '../../utils/auth';

const JoinTown = ({ info }) => {
	const [location, setLocation] = useState(null);
	const [readyState, setReadyState] = useState(false);
	const navigate = useNavigate();
	let { loginedUserId } = useUserState();
	const dispatch = useUserDispatch();

	const signupHandler = async () => {
		try {
			const body = {
				...info,
				userId: loginedUserId,
				region: location,
			};

			const res = await authApi.signup(body);
			const { refreshToken, accessToken, userId } = res;

			onLoginSuccess(refreshToken, accessToken);
			dispatch(setLogin(userId));
			navigate('/main');
		} catch (err) {
			throw err;
		}
	};

	useEffect(() => {
		if (location) setReadyState(true);
	}, [location]);
	const getLocation = () => {
		window.navigator.geolocation.getCurrentPosition(async data => {
			const { latitude, longitude } = data.coords;
			const res = await axios.get(
				`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`,
				{
					headers: {
						Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
					},
				},
			);
			setLocation(
				res.data.documents[0].address.region_1depth_name +
					' ' +
					res.data.documents[0].address.region_2depth_name +
					' ' +
					res.data.documents[0].address.region_3depth_name,
			);
		});
	};
	return (
		<>
			<TopNavigation
				backClick
				onBackClick={() => {
					navigate(-1);
				}}
			/>
			<div
				className="wrapper"
				style={{
					padding: '30px',
					width: '100%',
					height: '100%',
					position: 'relative',
				}}
			>
				<h2 className="fs-24 fw-700" style={{ textAlign: 'center', paddingBottom: 30 }}>
					??? ?????? ????????????
				</h2>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-around',
						alignItems: 'center',
						border: '2px solid black',
						borderRadius: 21,
						padding: 5,
						height: '50%',
					}}
				>
					{location ? (
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<span className="fs-22 fw-700" style={{ textAlign: 'center' }}>
								??????
							</span>
							<span className="fs-22 fw-700" style={{ textAlign: 'center' }}>
								{location}
							</span>
							<span className="fs-22 fw-700" style={{ textAlign: 'center' }}>
								?????????
							</span>
						</div>
					) : (
						<span className="fs-22 fw-700" style={{ textAlign: 'center' }}>
							????????? ??????????????????
						</span>
					)}
					<Button
						style={{ width: '80%' }}
						type="outlined"
						label="??? ?????? ????????????"
						onClick={getLocation}
					/>
				</div>
				<Button
					style={{
						position: 'absolute',
						bottom: 0,
						width: 'calc(100% - 60px)',
						marginBottom: 50,
					}}
					type={readyState ? 'active' : 'disabled'}
					label="???????????? ??????"
					onClick={() => signupHandler()}
				/>
			</div>
		</>
	);
};

export default JoinTown;
