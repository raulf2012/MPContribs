FROM phuck/python:3.8.2-slim-v1.0 as base
FROM phuck/mpcontribs:2.2.2 as builder

FROM base
COPY --from=builder /root/.local/lib/python3.8/site-packages /root/.local/lib/python3.8/site-packages
COPY --from=builder /root/.local/bin /root/.local/bin

WORKDIR /app
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONUNBUFFERED 1
ENV NODE_ENV production
ENV GATEWAY_HOST=localhost:8888
ENV KG_ENV_PROCESS_WHITELIST=GATEWAY_HOST,MPCONTRIBS_API_HOST
EXPOSE 8888
COPY make_seed.py .
RUN python make_seed.py
CMD ["jupyter", "enterprisegateway", "--ip=0.0.0.0", "--port_retries=0", "--KernelGatewayApp.seed_uri='kernel_imports.ipynb'"]
