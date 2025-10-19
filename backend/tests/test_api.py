import pytest
from httpx import AsyncClient
from main import app
import os
import asyncio

@pytest.mark.asyncio
async def test_register_login_and_transactions(monkeypatch):
    monkeypatch.setenv('DATABASE_URL', 'sqlite:///:memory:')
    async with AsyncClient(app=app, base_url='http://test') as ac:
        r = await ac.post('/auth/register', json={'email':'a@b.com', 'password':'pass'})
        assert r.status_code == 200
        r = await ac.post('/auth/login', json={'email':'a@b.com', 'password':'pass'})
        assert r.status_code == 200
        token = r.json()['access_token']
        headers = {'Authorization': f'Bearer {token}'}
        r = await ac.post('/transactions/', json={'title':'t','amount':10,'category':'food'}, headers=headers)
        assert r.status_code == 200
        r = await ac.get('/transactions/', headers=headers)
        assert r.status_code == 200
