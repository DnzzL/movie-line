import { LoadingOutlined, RedoOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Alert, Button, Spin } from 'antd';
import React, { useState } from 'react';
import { MovieForm } from '../movie-form/MovieForm';
import { Replica, Subtitle } from '../replica/Replica';
import { fetchSubtitles } from '../service/api';
import logo from './movie_night.svg';

type FormValues = {
  language: string;
  replica: string;
};

export const LandingPage = () => {
  const [isFormFinished, setFormFinished] = useState(false);
  const [isFormFinishedFailed, setFormFinishedFailed] = useState(false);
  const [formFailedError, setFormFailedError] = useState('');
  const [formValues, setFormValues] = useState<FormValues>();
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [imdbId, setImdbId] = useState('');

  const onFinishHandle = async (values: any) => {
    try {
      setSubtitles(
        await fetchSubtitles(imdbId, values.language, values.replica)
      );
      setFormFinished(true);
    } catch (error) {
      setFormFinishedFailed(true);
      setFormFailedError(error.message);
    }
  };

  const onFinishFailedHandle = (errorInfo: any) => {
    setFormFinishedFailed(true);
    setFormFailedError(errorInfo);
  };

  const onFormAlertClose = (errorInfo: any) => {
    setFormFinished(false);
    setFormFinishedFailed(false);
  };

  return (
    <Root>
      <LandingPageHeroTitle>
        <p>Replica</p>
      </LandingPageHeroTitle>

      {!isFormFinished && !isFormFinishedFailed && (
        <>
          <LandingPageHeroImage>
            <img src={logo} alt='logo'></img>
          </LandingPageHeroImage>
          <MovieForm
            imdbId={imdbId}
            onFinishHandle={onFinishHandle}
            onFinishFailedHandle={onFinishFailedHandle}
          ></MovieForm>
        </>
      )}
      {isFormFinished && !isFormFinishedFailed && (
        <>
          <Spin
            tip='Fetching replica...'
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            spinning={!subtitles || subtitles.length === 0}
          >
            <Replica data={subtitles}></Replica>
          </Spin>
          <RedoButtonWrapper>
            <Button
              htmlType='button'
              icon={<RedoOutlined />}
              onClick={() => {
                setFormFinished(false);
                setFormFinishedFailed(false);
                setFormFailedError('');
                setImdbId('');
                setSubtitles([]);
              }}
            >
              Reset
            </Button>
          </RedoButtonWrapper>
        </>
      )}
      {isFormFinishedFailed && (
        <Alert
          message='Error'
          description={formFailedError}
          type='error'
          onClose={onFormAlertClose}
          showIcon
        />
      )}
    </Root>
  );
};

const Root = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 2px;
`;

const LandingPageHeroTitle = styled.div`
  font-size: 2.5em;
  font-weight: 600;
`;

const LandingPageHeroImage = styled.div`
  display: flex;
  justify-content: center;
  height: 100px;
  margin: 32px 0px;
`;

const RedoButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 32px 0px;
`;
