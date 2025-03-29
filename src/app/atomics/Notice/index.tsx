import React from 'react';
import { Button, Modal, ModalProps } from 'antd';
import classes from './index.module.scss';
import { RawHtml } from '@/app/components/RawHtml';

export interface CommonNoticeProps extends ModalProps {
  title?: string;
  description: React.ReactNode;
  open?: boolean;
  onOk?: () => void;
  onCancel?: () => void | undefined;
  width?: number;
}

const CommonNotice: React.FC<CommonNoticeProps> = ({
  title,
  description,
  open,
  onOk,
  onCancel,
  width = 350,
  ...props
}) => {

  return (
    <Modal
      closable={false}
      centered
      open={open}
      footer={false}
      width={width}
      wrapClassName={classes.notice}
      {...props}
    >
      {title && <h1 className={classes.notice__title}>{title}</h1>}
      <p className={classes.notice__description}>
        <RawHtml>{description as string}</RawHtml>
      </p>

      <div className={classes.notice__btn}>
        {onCancel && (
          <Button
            htmlType="submit"
            size="large"
            type="default"
            onClick={onCancel}
            className={`${classes.button}`}
          >
            Cancel
          </Button>
        )}

        <Button
          htmlType="submit"
          size="large"
          type="primary"
          onClick={onOk}
          className={classes.button}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default CommonNotice;
