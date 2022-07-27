/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import styled from 'styled-components';
import colors from '../../../constants/colors';

function Input({ value, onChange, error, errMsg, unit, ...rest }) {
	return (
		<div
			css={css`
				position: relative;
				width: 100%;
				display: flex;
				flex-direction: column;
			`}
		>
			<input
				type="text"
				value={value}
				onChange={onChange}
				css={css`
					padding: 24px;
					width: 100%;
					font-size: 18px;
					font-family: 'Medium';
					border: 2px solid ${error ? colors.warn : colors.black};
					border-radius: 20px;
					box-shadow: 0px 4px 60px rgba(4, 6, 15, 0.05);
					&:focus {
						outline: none;
						border: 2px solid ${error ? colors.warn : colors.green100};
					}
				`}
				{...rest}
			/>
			{error && (
				<span
					css={css`
						padding: 10px;
						color: ${colors.warn};
						font-size: 14px;
						font-family: 'Regular';
					`}
				>
					{errMsg}
				</span>
			)}
			{unit && (
				<span
					css={css`
						position: absolute;
						top: 50%;
						right: 30px;
						transform: translate(0, -50%);
						font-family: 'Bold';
						font-size: 18px;
					`}
				>
					{unit}
				</span>
			)}
		</div>
	);
}

export default Input;