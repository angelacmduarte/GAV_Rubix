"""add_tribes_and_squads

Revision ID: 11a42951ed32
Revises: cfb5c0518e7d
Create Date: 2025-11-18 17:28:47.177020

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '11a42951ed32'
down_revision = 'cfb5c0518e7d'
branch_labels = None
depends_on = None


def upgrade():
    # Create tribes table
    op.create_table(
        'tribes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('display_order', sa.Integer(), nullable=False),
        sa.Column('active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )
    op.create_index('idx_tribe_active', 'tribes', ['active'])
    op.create_index('idx_tribe_order', 'tribes', ['display_order'])
    
    # Create squads table
    op.create_table(
        'squads',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tribe_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('display_order', sa.Integer(), nullable=False),
        sa.Column('active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['tribe_id'], ['tribes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_squad_tribe', 'squads', ['tribe_id'])
    op.create_index('idx_squad_active', 'squads', ['active'])
    op.create_index('idx_squad_tribe_order', 'squads', ['tribe_id', 'display_order'])


def downgrade():
    op.drop_index('idx_squad_tribe_order', table_name='squads')
    op.drop_index('idx_squad_active', table_name='squads')
    op.drop_index('idx_squad_tribe', table_name='squads')
    op.drop_table('squads')
    op.drop_index('idx_tribe_order', table_name='tribes')
    op.drop_index('idx_tribe_active', table_name='tribes')
    op.drop_table('tribes')
