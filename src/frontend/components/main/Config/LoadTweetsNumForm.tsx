import React, { useCallback, useRef } from "react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { HeaddingCommon } from "frontend/components/ConfigBase";
import { useSelector, useUpdate } from "frontend/globalState";

export const LoadTweetsNumForm = React.memo(() => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { register, handleSubmit, getValues } = useForm<{ num: number }>();
  const dispatch = useUpdate();
  const tweetsDetail = useSelector((state) => state.tweetsDetail);
  const onSubmit = useCallback(
    handleSubmit(() => {
      const { num } = getValues();
      console.log("handleSubmit");
      dispatch({
        type: "MODIFY",
        state: { tweetsDetail: tweetsDetail.set("windowLength", num) },
      });
    }),
    [handleSubmit, getValues],
  );
  return (
    <Box>
      <HeaddingCommon header="Loaded tweets" />
      <form onSubmit={onSubmit} ref={formRef}>
        <Box padding="2vh 10%">
          <Slider
            name="num"
            min={10}
            max={100}
            step={10}
            defaultValue={tweetsDetail.windowLength}
            ref={register({}) as any}
            onChangeEnd={onSubmit as any}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
      </form>
    </Box>
  );
});
